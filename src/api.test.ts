import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import api, { session, SESSION_EXPIRED } from './api';

const user = { id: 1, name: 'Ana', email: 'ana@example.com', role: 'admin' as const };

const respond = (config: InternalAxiosRequestConfig, status: number, data: unknown = {}) =>
  status < 400
    ? Promise.resolve({ data, status, statusText: '', headers: {}, config })
    : Promise.reject(Object.assign(new Error(`HTTP ${status}`), { config, response: { status, data } }));

describe('api', () => {
  let calls: InternalAxiosRequestConfig[];

  const serve = (handler: (config: InternalAxiosRequestConfig) => Promise<unknown>) => {
    calls = [];
    api.defaults.adapter = (config => {
      calls.push(config);
      return handler(config);
    }) as AxiosAdapter;
  };

  beforeEach(() => {
    localStorage.clear();
    session.save({ token: 'old-token', refreshToken: 'refresh-1', user });
  });

  it('sends the stored token on every request', async () => {
    serve(config => respond(config, 200));

    await api.get('/subjects');

    expect(calls[0].headers.Authorization).toBe('Bearer old-token');
  });

  it('refreshes an expired token once and retries the request', async () => {
    serve(config => {
      if (config.url === '/refresh-tokens') {
        return respond(config, 200, { token: 'new-token', refreshToken: 'refresh-2', user });
      }
      return respond(config, config.headers.Authorization === 'Bearer new-token' ? 200 : 401, { ok: true });
    });

    const response = await api.get('/subjects');

    expect(response.data).toEqual({ ok: true });
    expect(calls.map(call => call.url)).toEqual(['/subjects', '/refresh-tokens', '/subjects']);
    expect(session.load()?.refreshToken).toBe('refresh-2');
  });

  it('ends the session when the refresh token is rejected', async () => {
    const expired = vi.fn();
    window.addEventListener(SESSION_EXPIRED, expired);
    serve(config => respond(config, 401));

    await expect(api.get('/subjects')).rejects.toThrow();

    expect(session.load()).toBeNull();
    expect(expired).toHaveBeenCalledOnce();
    window.removeEventListener(SESSION_EXPIRED, expired);
  });

  it('gives up when the retried request is still unauthorized', async () => {
    serve(config =>
      config.url === '/refresh-tokens'
        ? respond(config, 200, { token: 'new-token', refreshToken: 'refresh-2', user })
        : respond(config, 401),
    );

    await expect(api.get('/subjects')).rejects.toThrow();

    expect(calls.map(call => call.url)).toEqual(['/subjects', '/refresh-tokens', '/subjects']);
  });

  it('does not try to refresh a failed sign in', async () => {
    serve(config => respond(config, 401));

    await expect(api.post('/sessions', {})).rejects.toThrow();

    expect(calls.map(call => call.url)).toEqual(['/sessions']);
  });
});
