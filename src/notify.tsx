import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';
import { isAxiosError } from 'axios';

type Notify = (message: string, severity?: AlertColor) => void;

const NotifyContext = createContext<Notify | null>(null);

export function errorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) return error.response?.data?.message ?? fallback;
  return error instanceof Error ? error.message : fallback;
}

export function NotifyProvider({ children }: PropsWithChildren) {
  const [notice, setNotice] = useState<{ message: string; severity: AlertColor } | null>(null);
  const notify = useCallback<Notify>((message, severity = 'success') => setNotice({ message, severity }), []);

  return (
    <NotifyContext value={notify}>
      {children}
      <Snackbar
        open={notice !== null}
        autoHideDuration={4000}
        onClose={() => setNotice(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={notice?.severity} variant="filled" onClose={() => setNotice(null)}>
          {notice?.message}
        </Alert>
      </Snackbar>
    </NotifyContext>
  );
}

export function useNotify(): Notify {
  const notify = useContext(NotifyContext);
  if (!notify) throw new Error('useNotify must be used within a NotifyProvider');
  return notify;
}
