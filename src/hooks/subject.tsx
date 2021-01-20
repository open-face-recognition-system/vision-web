import React, { createContext, useCallback, useContext } from 'react';
import api from '../services/api';
import { Student } from './student';

export interface Subject {
  id: number;
  name: string;
  course: string;
  description: string;
  teacher: Teacher;
  recognitionFile: string | null;
  students: StudentSubject[];
}

export interface StudentSubject {
  attendanceId: number;
  isEnrolled: boolean;
  isPresent: boolean;
  student: Student;
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
  limit: number;
}

interface PaginationAwareObject {
  total: number | any;
  data: Subject[];
}

interface SubjectContextData {
  listSubjects(pagination: Pagination): Promise<PaginationAwareObject>;
  listTeacherSubjects(pagination: Pagination): Promise<PaginationAwareObject>;
  showSubject(id: number): Promise<Subject>;
  enrollStudent(id: number, studnetId: number): Promise<Student>;
  enrollByPdfStudent(id: number, data: FormData): Promise<Student>;
  unenrollStudent(id: number, studnetId: number): Promise<void>;
  createSubject(subject: SubjectRequest): Promise<Subject>;
  training(id: number): Promise<void>;
  updateSubject(id: number, subject: SubjectRequest): Promise<Subject>;
  deleteSubject(id: number): Promise<void>;
}

const SubjectContext = createContext<SubjectContextData>(
  {} as SubjectContextData,
);

const SubjectProvider: React.FC = ({ children }) => {
  const listSubjects = useCallback(async (pagination: Pagination) => {
    const { page, limit } = pagination;
    const response = await api.get<PaginationAwareObject>('/subjects', {
      params: {
        page,
        limit,
      },
    });

    const subjects = response.data;

    return subjects;
  }, []);

  const listTeacherSubjects = useCallback(async (pagination: Pagination) => {
    const { page, limit } = pagination;
    const response = await api.get<PaginationAwareObject>('/subjects/teacher', {
      params: {
        page,
        limit,
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

  const updateSubject = useCallback(
    async (
      id: number,
      { name, description, course, teacherId }: SubjectRequest,
    ) => {
      const response = await api.put<Subject>(`/subjects/${id}`, {
        name,
        description,
        course,
        teacherId,
      });
      return response.data;
    },
    [],
  );

  const enrollStudent = useCallback(async (id: number, studentId: number) => {
    const response = await api.post<Student>(`/subjects/${id}/enroll`, {
      studentId,
    });
    return response.data;
  }, []);

  const enrollByPdfStudent = useCallback(async (id: number, data: FormData) => {
    const response = await api.post<Student>(
      `/subjects/${id}/enroll/pdf`,
      data,
    );
    return response.data;
  }, []);

  const unenrollStudent = useCallback(async (id: number, studentId: number) => {
    const response = await api.post(`/subjects/${id}/unenroll`, {
      studentId,
    });
    return response.data;
  }, []);

  const training = useCallback(async (id: number) => {
    await api.post<Student>(`/training/${id}`);
  }, []);

  const deleteSubject = useCallback(async (id: number) => {
    await api.delete(`/subjects/${id}`);
  }, []);

  return (
    <SubjectContext.Provider
      value={{
        listSubjects,
        listTeacherSubjects,
        showSubject,
        createSubject,
        updateSubject,
        enrollStudent,
        enrollByPdfStudent,
        unenrollStudent,
        training,
        deleteSubject,
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
