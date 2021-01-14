import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

export interface Teacher {
  id: number;
  enrollment: string;
  user: User;
}

export interface UpdateTeacherRequest {
  name: string;
  email: string;
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
  limit: number;
}

interface PaginationAwareObject {
  total: number | any;
  data: Teacher[];
}

interface TeacherContextData {
  loading: boolean;
  listTeachers(
    pagination: Pagination,
    query?: any,
  ): Promise<PaginationAwareObject>;
  showTeacher(id: number): Promise<Teacher>;
  createTeacher(teacher: TeacherRequest): Promise<Teacher>;
  updateTeacher(id: number, teacher: UpdateTeacherRequest): Promise<Teacher>;
}

const TeacherContext = createContext<TeacherContextData>(
  {} as TeacherContextData,
);

const TeacherProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<TeacherState>(() => {
    return {} as TeacherState;
  });

  const listTeachers = useCallback(
    async (pagination: Pagination, query?: any) => {
      setData({ loading: true });
      const { page, limit } = pagination;
      const response = await api.get<PaginationAwareObject>('/teachers', {
        params: {
          page,
          limit,
          ...query,
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

  const updateTeacher = useCallback(
    async (id: number, { name, email }: UpdateTeacherRequest) => {
      const response = await api.put<Teacher>(`/teachers/${id}`, {
        name,
        email,
      });
      return response.data;
    },
    [],
  );

  return (
    <TeacherContext.Provider
      value={{
        loading: data.loading,
        listTeachers,
        showTeacher,
        createTeacher,
        updateTeacher,
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
