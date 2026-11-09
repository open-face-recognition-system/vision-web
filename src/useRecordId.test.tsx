import { renderHook } from '@testing-library/react';
import { createElement, PropsWithChildren } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import useRecordId from './useRecordId';

const at = (path: string) => ({ children }: PropsWithChildren) =>
  createElement(
    MemoryRouter,
    { initialEntries: [path] },
    createElement(
      Routes,
      null,
      createElement(Route, { path: '/things/new', element: children }),
      createElement(Route, { path: '/things/:id/edit', element: children }),
    ),
  );

describe('useRecordId', () => {
  it('returns null on a creation route', () => {
    expect(renderHook(useRecordId, { wrapper: at('/things/new') }).result.current).toBeNull();
  });

  it('returns the numeric id on an edit route', () => {
    expect(renderHook(useRecordId, { wrapper: at('/things/42/edit') }).result.current).toBe(42);
  });

  it('never treats a malformed edit route as a creation', () => {
    expect(renderHook(useRecordId, { wrapper: at('/things/abc/edit') }).result.current).not.toBeNull();
  });
});
