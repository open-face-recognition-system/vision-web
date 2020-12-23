import React from 'react';

import { AuthProvider } from './auth';
import { StudentProvider } from './student';
import { SnackProvider } from './snackbar';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <StudentProvider>
      <SnackProvider>{children}</SnackProvider>
    </StudentProvider>
  </AuthProvider>
);

export default AppProvider;
