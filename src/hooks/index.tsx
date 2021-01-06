import React from 'react';

import { AuthProvider } from './auth';
import { StudentProvider } from './student';
import { SnackProvider } from './snackbar';
import { TeacherProvider } from './teacher';
import { SubjectProvider } from './subject';
import { SemesterProvider } from './semester';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <StudentProvider>
      <TeacherProvider>
        <SubjectProvider>
          <SemesterProvider>
            <SnackProvider>{children}</SnackProvider>
          </SemesterProvider>
        </SubjectProvider>
      </TeacherProvider>
    </StudentProvider>
  </AuthProvider>
);

export default AppProvider;
