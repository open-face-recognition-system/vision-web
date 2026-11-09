import { PropsWithChildren } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import theme from './theme';
import { AuthProvider } from './auth';
import { NotifyProvider } from './notify';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <NotifyProvider>
          <AuthProvider>{children}</AuthProvider>
        </NotifyProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
