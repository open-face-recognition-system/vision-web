import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import api, { Session, SESSION_EXPIRED, session, User } from './api';

export class StudentSignInError extends Error {
  constructor() {
    super('Alunos usam o aplicativo Vision no celular.');
  }
}

interface Auth {
  user: User | null;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [current, setCurrent] = useState(session.load);

  useEffect(() => {
    const expire = () => setCurrent(null);
    window.addEventListener(SESSION_EXPIRED, expire);
    return () => window.removeEventListener(SESSION_EXPIRED, expire);
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data } = await api.post<Session>('/sessions', { email, password });
    if (data.user.role === 'student') throw new StudentSignInError();
    session.save(data);
    setCurrent(data);
  };

  const signOut = () => {
    session.clear();
    setCurrent(null);
  };

  return <AuthContext value={{ user: current?.user ?? null, signIn, signOut }}>{children}</AuthContext>;
}

export function useAuth(): Auth {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('useAuth must be used within an AuthProvider');
  return auth;
}
