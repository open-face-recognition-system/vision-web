import React from 'react';

import { AuthProvider } from './auth';
import { StudentProvider } from './student';
import { SnackProvider } from './snackbar';
import { TeacherProvider } from './teacher';
import { SubjectProvider } from './subject';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <StudentProvider>
      <TeacherProvider>
        <SubjectProvider>
          <SnackProvider>{children}</SnackProvider>
        </SubjectProvider>
      </TeacherProvider>
    </StudentProvider>
  </AuthProvider>
);

export default AppProvider;
