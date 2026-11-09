import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { session, Role } from './api';
import Providers from './Providers';
import routes from './routes';

vi.mock('./resources', async original => {
  const empty = () => Promise.resolve({ total: 0, data: [] });
  const actual = await original<typeof import('./resources')>();
  const stub = <T extends object>(resource: T) =>
    Object.fromEntries(Object.keys(resource).map(key => [key, empty])) as T;
  return {
    ...actual,
    semesters: stub(actual.semesters),
    students: stub(actual.students),
    teachers: stub(actual.teachers),
    subjects: stub(actual.subjects),
    classes: stub(actual.classes),
  };
});

const signInAs = (role: Role) =>
  session.save({ token: 't', refreshToken: 'r', user: { id: 1, name: 'Ana', email: 'a@a.com', role } });

const visit = (path: string) => {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <Providers>
      <RouterProvider router={router} />
    </Providers>,
  );
  return router;
};

describe('routes', () => {
  beforeEach(() => localStorage.clear());

  it('sends anonymous visitors to the sign in page', async () => {
    const router = visit('/classes');

    expect(await screen.findByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/sign-in');
  });

  it('keeps teachers out of admin pages', async () => {
    signInAs('teacher');

    const router = visit('/teachers');

    expect(await screen.findByText('Aulas', { selector: 'h6' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/classes');
  });

  it('shows the admin menu to admins', async () => {
    signInAs('admin');

    visit('/teachers');

    expect(await screen.findByText('Professores', { selector: 'h6' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Alunos' })).toBeInTheDocument();
  });

  it('hides admin menu entries from teachers', async () => {
    signInAs('teacher');

    visit('/classes');

    await screen.findByText('Aulas', { selector: 'h6' });
    expect(screen.queryByRole('link', { name: 'Professores' })).not.toBeInTheDocument();
  });
});
