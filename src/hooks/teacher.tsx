import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

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

export interface UserRequest {
  name: string;
  email: string;
}

export interface TeacherRequest {
  enrollment: string;
  user: UserRequest;
}

export interface Photo {
  id: number;
  updatedAt: string;
  url: string;
}

interface TeacherState {
  loading: boolean;
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
  data: Teacher[];
}

interface TeacherContextData {
  loading: boolean;
  listTeachers(pagination: Pagination): Promise<PaginationAwareObject>;
  showTeacher(id: number): Promise<Teacher>;
  createTeacher(teacher: TeacherRequest): Promise<Teacher>;
}

const TeacherContext = createContext<TeacherContextData>(
  {} as TeacherContextData,
);

const TeacherProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<TeacherState>(() => {
    return {} as TeacherState;
  });

  const listTeachers = useCallback(
    async (pagination: Pagination) => {
      setData({ loading: true });
      const { page, per_page } = pagination;
      const response = await api.get<PaginationAwareObject>('/teachers', {
        params: {
          page,
          per_page,
        },
      });

      const teachers = response.data;

      setData({ loading: false });
      return teachers;
    },
    [setData],
  );

  const showTeacher = useCallback(async (id: number) => {
    setData({ loading: true });
    const response = await api.get<Teacher>(`/teachers/${id}`);

    const teacher = response.data;
    setData({ loading: false });
    return teacher;
  }, []);

  const createTeacher = useCallback(async (teacher: TeacherRequest) => {
    const { user } = teacher;
    setData({ loading: true });
    const userResponse = await api.post<User>('/users', {
      name: user.name,
      email: user.email,
      password: '123123',
    });
    const { id } = userResponse.data;

    const response = await api.post<Teacher>('/teachers', {
      enrollment: teacher.enrollment,
      userId: id,
    });
    setData({ loading: false });
    return response.data;
  }, []);

  return (
    <TeacherContext.Provider
      value={{
        loading: data.loading,
        listTeachers,
        showTeacher,
        createTeacher,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

function useTeacher(): TeacherContextData {
  const context = useContext(TeacherContext);

  if (!context) {
    throw new Error('useTeacher must be used within an TeacherProvider');
  }

  return context;
}

export { TeacherProvider, useTeacher };
