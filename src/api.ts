import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export type Role = 'admin' | 'teacher' | 'student';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Session {
  token: string;
  refreshToken: string;
  user: User;
}

export const SESSION_EXPIRED = 'vision:session-expired';

const SESSION_KEY = '@vision:session';
const AUTH_URLS = ['/sessions', '/refresh-tokens'];

export const session = {
  load: (): Session | null => JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null'),
  save: (current: Session): void => localStorage.setItem(SESSION_KEY, JSON.stringify(current)),
  clear: (): void => localStorage.removeItem(SESSION_KEY),
};

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = session.load()?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { retried?: boolean };

api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as RetriableConfig | undefined;
  const current = session.load();

  if (error.response?.status !== 401 || !config || config.retried || AUTH_URLS.includes(config.url ?? '') || !current) {
    throw error;
  }

  try {
    const { data } = await api.post<Session>('/refresh-tokens', { refreshToken: current.refreshToken });
    session.save(data);
  } catch {
    session.clear();
    window.dispatchEvent(new Event(SESSION_EXPIRED));
    throw error;
  }

  config.retried = true;
  return api(config);
});

export default api;
