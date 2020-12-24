import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

export interface Student {
  id: number;
  enrollment: string;
  user: User;
  photos: Photo[];
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

export interface StudentRequest {
  enrollment: string;
  user: UserRequest;
}

export interface Photo {
  id: number;
  updatedAt: string;
  url: string;
}

interface StudentState {
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
  data: Student[];
}

interface StudentContextData {
  loading: boolean;
  listStudents(pagination: Pagination): Promise<PaginationAwareObject>;
  showStudent(id: number): Promise<Student>;
  createStudent(student: StudentRequest): Promise<Student>;
}

const StudentContext = createContext<StudentContextData>(
  {} as StudentContextData,
);

const StudentProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<StudentState>(() => {
    return {} as StudentState;
  });

  const listStudents = useCallback(
    async (pagination: Pagination) => {
      setData({ loading: true });
      const { page, per_page } = pagination;
      const response = await api.get<PaginationAwareObject>('/students', {
        params: {
          page,
          per_page,
        },
      });

      const students = response.data;

      setData({ loading: false });
      return students;
    },
    [setData],
  );

  const showStudent = useCallback(async (id: number) => {
    setData({ loading: true });
    const response = await api.get<Student>(`/students/${id}`);

    const student = response.data;
    setData({ loading: false });
    return student;
  }, []);

  const createStudent = useCallback(async (student: StudentRequest) => {
    const { user } = student;
    setData({ loading: true });
    const userResponse = await api.post<User>('/users', {
      name: user.name,
      email: user.email,
      password: '123123',
    });
    const { id } = userResponse.data;

    const response = await api.post<Student>('/students', {
      enrollment: student.enrollment,
      userId: id,
    });
    setData({ loading: false });
    return response.data;
  }, []);

  return (
    <StudentContext.Provider
      value={{
        loading: data.loading,
        listStudents,
        showStudent,
        createStudent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

function useStudent(): StudentContextData {
  const context = useContext(StudentContext);

  if (!context) {
    throw new Error('useStudent must be used within an StudentProvider');
  }

  return context;
}

export { StudentProvider, useStudent };
