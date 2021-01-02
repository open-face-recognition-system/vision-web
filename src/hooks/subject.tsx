import React, { createContext, useCallback, useContext } from 'react';
import api from '../services/api';

export interface Subject {
  id: number;
  name: string;
  course: string;
  description: string;
  teacher: Teacher;
  recognitionFile: string | null;
}

export interface Teacher {
  id: number;
  enrollment: string;
  user: User;
}
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface SubjectRequest {
  name: string;
  course: string;
  description: string;
  teacherId: number;
}

interface Pagination {
  page: number;
  per_page: number;
}

interface PaginationAwareObject {
  from: any;
  to: any;
  per_page: any;
  total: number | any;
  current_page: number;
  prev_page?: number | null;
  next_page?: number | null;
  data: Subject[];
}

interface SubjectContextData {
  listSubjects(pagination: Pagination): Promise<PaginationAwareObject>;
  showSubject(id: number): Promise<Subject>;
  createSubject(subject: SubjectRequest): Promise<Subject>;
}

const SubjectContext = createContext<SubjectContextData>(
  {} as SubjectContextData,
);

const SubjectProvider: React.FC = ({ children }) => {
  const listSubjects = useCallback(async (pagination: Pagination) => {
    const { page, per_page } = pagination;
    const response = await api.get<PaginationAwareObject>('/subjects', {
      params: {
        page,
        per_page,
      },
    });

    const subjects = response.data;

    return subjects;
  }, []);

  const showSubject = useCallback(async (id: number) => {
    const response = await api.get<Subject>(`/subjects/${id}`);

    const subject = response.data;
    return subject;
  }, []);

  const createSubject = useCallback(
    async ({ name, description, course, teacherId }: SubjectRequest) => {
      const response = await api.post<Subject>('/subjects', {
        name,
        description,
        course,
        teacherId,
      });
      return response.data;
    },
    [],
  );

  return (
    <SubjectContext.Provider
      value={{
        listSubjects,
        showSubject,
        createSubject,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

function useSubject(): SubjectContextData {
  const context = useContext(SubjectContext);

  if (!context) {
    throw new Error('useSubject must be used within an SubjectProvider');
  }

  return context;
}

export { SubjectProvider, useSubject };
