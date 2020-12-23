import React, { createContext, useContext, useCallback, useState } from 'react';

import SnackContainer from '../components/Snackbar';

export interface SnackMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  open: boolean;
}

interface SnackContextData {
  openSnack(snack: SnackMessage): void;
  closeSnack(): void;
}

const SnackContext = createContext<SnackContextData>({} as SnackContextData);

const SnackProvider: React.FC = ({ children }) => {
  const [snack, setSnack] = useState<SnackMessage>({
    type: 'info',
    title: 'title',
    open: false,
  });

  const openSnack = useCallback(({ type, title }: SnackMessage) => {
    const newSnack = {
      type,
      title,
      open: true,
    };

    setSnack(newSnack);
  }, []);

  const closeSnack = useCallback(() => {
    setSnack({
      type: 'info',
      title: 'title',
      open: false,
    });
  }, []);

  return (
    <SnackContext.Provider value={{ openSnack, closeSnack }}>
      {children}
      <SnackContainer snack={snack} />
    </SnackContext.Provider>
  );
};

function useSnack(): SnackContextData {
  const context = useContext(SnackContext);

  if (!context) {
    throw new Error('useSnack must be used within a SnackProvider');
  }

  return context;
}

export { SnackProvider, useSnack };
