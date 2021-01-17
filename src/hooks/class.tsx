import React, { createContext, useCallback, useContext } from 'react';
import CreateClassRequest from '../dtos/CreateClassRequest';
import CreateAttendanceRequest from '../dtos/CreateAttendanceRequest';
import api from '../services/api';
import { Semester } from './semester';
import { Student } from './student';
import { Subject } from './subject';

export interface ClassItem {
  id: number;
  startHour: Date;
  endHour: Date;
  date: Date;
  subject: Subject;
  semester: Semester;
  attendances: Attendance[];
}

export interface Attendance {
  id: number;
  isPresent: boolean;
  student: Student;
}

interface Pagination {
  page: number;
  limit: number;
}

interface PaginationAwareObject {
  total: number | any;
  data: ClassItem[];
}

interface ClassItemContextData {
  listClasses(pagination: Pagination): Promise<PaginationAwareObject>;
  showClass(id: number): Promise<ClassItem>;
  createClass(classRequest: CreateClassRequest): Promise<ClassItem>;
  updateClass(id: number, classRequest: CreateClassRequest): Promise<ClassItem>;
  updateAttendanceClass(
    id: number,
    createAttendance: CreateAttendanceRequest,
  ): Promise<ClassItem>;
  deleteClass(id: number): Promise<void>;
}

const ClassItemContext = createContext<ClassItemContextData>(
  {} as ClassItemContextData,
);

const ClassItemProvider: React.FC = ({ children }) => {
  const listClasses = useCallback(async (pagination: Pagination) => {
    const { page, limit } = pagination;
    const response = await api.get<PaginationAwareObject>('/classes', {
      params: {
        page,
        limit,
        order: '+startHour',
      },
    });

    const classes = response.data;

    return classes;
  }, []);

  const showClass = useCallback(async (id: number) => {
    const response = await api.get<ClassItem>(`/classes/${id}`);

    const semester = response.data;
    return semester;
  }, []);

  const createClass = useCallback(
    async ({
      startHour,
      endHour,
      date,
      subjectId,
      semesterId,
    }: CreateClassRequest) => {
      const response = await api.post<ClassItem>('/classes', {
        startHour,
        endHour,
        date,
        subjectId,
        semesterId,
      });
      return response.data;
    },
    [],
  );

  const updateClass = useCallback(
    async (
      id: number,
      { startHour, endHour, date, subjectId, semesterId }: CreateClassRequest,
    ) => {
      const response = await api.put<ClassItem>(`/classes/${id}`, {
        startHour,
        endHour,
        date,
        subjectId,
        semesterId,
      });
      return response.data;
    },
    [],
  );

  const updateAttendanceClass = useCallback(
    async (
      id: number,
      { isPresent, classId, studentId }: CreateAttendanceRequest,
    ) => {
      const response = await api.put<ClassItem>(`/attendances/${id}`, {
        isPresent,
        classId,
        studentId,
      });
      return response.data;
    },
    [],
  );

  const deleteClass = useCallback(async (id: number) => {
    await api.delete(`/classes/${id}`);
  }, []);

  return (
    <ClassItemContext.Provider
      value={{
        listClasses,
        showClass,
        createClass,
        updateClass,
        updateAttendanceClass,
        deleteClass,
      }}
    >
      {children}
    </ClassItemContext.Provider>
  );
};

function useClassItem(): ClassItemContextData {
  const context = useContext(ClassItemContext);

  if (!context) {
    throw new Error('useClassItem must be used within an ClassItemProvider');
  }

  return context;
}

export { ClassItemProvider, useClassItem };
