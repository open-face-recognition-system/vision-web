import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

export interface Student {
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
  students: Student[];
}

interface StudentContextData {
  students: Student[];
  listStudents(): Promise<Student[]>;
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

  const listStudents = useCallback(async () => {
    const response = await api.get<Student[]>('/students');

    const students = response.data;

    setData({ students });
    return students;
  }, [setData]);

  const showStudent = useCallback(async (id: number) => {
    const response = await api.get<Student>(`/students/${id}`);

    const student = response.data;

    return student;
  }, []);

  const createStudent = useCallback(async (student: StudentRequest) => {
    const { user } = student;
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

    return response.data;
  }, []);

  return (
    <StudentContext.Provider
      value={{
        students: data.students,
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