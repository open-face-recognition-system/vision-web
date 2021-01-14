import React from 'react';

import { AuthProvider } from './auth';
import { StudentProvider } from './student';
import { SnackProvider } from './snackbar';
import { TeacherProvider } from './teacher';
import { SubjectProvider } from './subject';
import { SemesterProvider } from './semester';
import { ClassItemProvider } from './class';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <StudentProvider>
      <TeacherProvider>
        <SubjectProvider>
          <SemesterProvider>
            <ClassItemProvider>
              <SnackProvider>{children}</SnackProvider>
            </ClassItemProvider>
          </SemesterProvider>
        </SubjectProvider>
      </TeacherProvider>
    </StudentProvider>
  </AuthProvider>
);

export default AppProvider;
