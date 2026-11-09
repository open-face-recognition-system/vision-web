import { Navigate, Outlet, RouteObject } from 'react-router';
import type { Role } from './api';
import { useAuth } from './auth';
import Layout from './components/Layout';
import SignIn from './pages/SignIn';
import { SemesterForm, SemesterList } from './pages/Semesters';
import { PersonForm, PersonList } from './pages/People';
import StudentDetails from './pages/StudentDetails';
import { SubjectForm, SubjectList } from './pages/Subjects';
import { AttendanceList, ClassForm, ClassList } from './pages/Classes';

function RequireRole({ roles }: { roles: Role[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/sign-in" replace />;
  return roles.includes(user.role) ? <Outlet /> : <Navigate to="/classes" replace />;
}

function GuestOnly() {
  const { user } = useAuth();
  return user ? <Navigate to="/classes" replace /> : <Outlet />;
}

const routes: RouteObject[] = [
  { element: <GuestOnly />, children: [{ path: '/sign-in', element: <SignIn /> }] },
  {
    element: <RequireRole roles={['admin', 'teacher']} />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/classes', element: <ClassList /> },
          { path: '/classes/:id/attendances', element: <AttendanceList /> },
          { path: '/subjects', element: <SubjectList /> },
          {
            element: <RequireRole roles={['admin']} />,
            children: [
              { path: '/classes/new', element: <ClassForm /> },
              { path: '/classes/:id/edit', element: <ClassForm /> },
              { path: '/subjects/new', element: <SubjectForm /> },
              { path: '/subjects/:id/edit', element: <SubjectForm /> },
              { path: '/semesters', element: <SemesterList /> },
              { path: '/semesters/new', element: <SemesterForm /> },
              { path: '/semesters/:id/edit', element: <SemesterForm /> },
              { path: '/students', element: <PersonList key="students" kind="students" /> },
              { path: '/students/new', element: <PersonForm key="students" kind="students" /> },
              { path: '/students/:id', element: <StudentDetails /> },
              { path: '/students/:id/edit', element: <PersonForm key="students" kind="students" /> },
              { path: '/teachers', element: <PersonList key="teachers" kind="teachers" /> },
              { path: '/teachers/new', element: <PersonForm key="teachers" kind="teachers" /> },
              { path: '/teachers/:id/edit', element: <PersonForm key="teachers" kind="teachers" /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/classes" replace /> },
];

export default routes;
