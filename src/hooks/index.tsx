import React from 'react';

import { AuthProvider } from './auth';
import { StudentProvider } from './student';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <StudentProvider>{children}</StudentProvider>
  </AuthProvider>
);

export default AppProvider;
