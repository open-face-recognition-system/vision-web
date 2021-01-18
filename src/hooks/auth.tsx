import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string;
  refreshToken: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  refreshToken(): Promise<void>;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@ofrs:token');
    const refreshToken = localStorage.getItem('@ofrs:refreshToken');
    const user = localStorage.getItem('@ofrs:user');

    if (token && user && refreshToken) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, refreshToken, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/sessions', {
      email,
      password,
    });
    const { token, refreshToken, user } = response.data;

    localStorage.setItem('@ofrs:token', token);
    localStorage.setItem('@ofrs:user', JSON.stringify(user));
    localStorage.setItem('@ofrs:refreshToken', refreshToken);

    api.defaults.headers.authorization = `Bearer ${token}`;
    setData({ token, refreshToken, user });
  }, []);

  const refreshToken = useCallback(async () => {
    const currentRefreshToken = localStorage.getItem('@ofrs:refreshToken');
    const response = await api.post('/refresh-tokens', {
      refreshToken: currentRefreshToken,
    });
    const { token, refreshToken: newRefreshToken, user } = response.data;

    localStorage.setItem('@ofrs:token', token);
    localStorage.setItem('@ofrs:user', JSON.stringify(user));
    localStorage.setItem('@ofrs:refreshToken', newRefreshToken);

    api.defaults.headers.authorization = `Bearer ${token}`;
    setData({ token, refreshToken: newRefreshToken, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@ofrs:token');
    localStorage.removeItem('@ofrs:user');
    localStorage.removeItem('@ofrs:refreshToken');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@ofrs:user', JSON.stringify(user));
      setData({
        token: data.token,
        refreshToken: data.refreshToken,
        user,
      });
    },
    [setData, data.token, data.refreshToken],
  );

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        signIn,
        signOut,
        refreshToken,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
