import React, { createContext, useCallback, useContext } from 'react';
import CreateSemesterRequest from '../dtos/CreateSemesterRequest';
import api from '../services/api';

export interface Semester {
  id: number;
  startDate: Date;
  endDate: Date;
}

interface Pagination {
  page: number;
  limit: number;
}

interface PaginationAwareObject {
  total: number | any;
  data: Semester[];
}

interface SemesterContextData {
  listSemesters(pagination: Pagination): Promise<PaginationAwareObject>;
  showSemester(id: number): Promise<Semester>;
  createSemester(semester: CreateSemesterRequest): Promise<Semester>;
  updateSemester(
    id: number,
    semester: CreateSemesterRequest,
  ): Promise<Semester>;
  deleteSemester(id: number): Promise<void>;
}

const SemesterContext = createContext<SemesterContextData>(
  {} as SemesterContextData,
);

const SemesterProvider: React.FC = ({ children }) => {
  const listSemesters = useCallback(async (pagination: Pagination) => {
    const { page, limit } = pagination;
    const response = await api.get<PaginationAwareObject>('/semesters', {
      params: {
        page,
        limit,
      },
    });

    const semesters = response.data;

    return semesters;
  }, []);

  const showSemester = useCallback(async (id: number) => {
    const response = await api.get<Semester>(`/semesters/${id}`);

    const semester = response.data;
    return semester;
  }, []);

  const createSemester = useCallback(
    async ({ startDate, endDate }: CreateSemesterRequest) => {
      const response = await api.post<Semester>('/semesters', {
        startDate,
        endDate,
      });
      return response.data;
    },
    [],
  );

  const updateSemester = useCallback(
    async (id: number, { startDate, endDate }: CreateSemesterRequest) => {
      const response = await api.put<Semester>(`/semesters/${id}`, {
        startDate,
        endDate,
      });
      return response.data;
    },
    [],
  );

  const deleteSemester = useCallback(async (id: number) => {
    await api.delete(`/semesters/${id}`);
  }, []);

  return (
    <SemesterContext.Provider
      value={{
        listSemesters,
        showSemester,
        createSemester,
        updateSemester,
        deleteSemester,
      }}
    >
      {children}
    </SemesterContext.Provider>
  );
};

function useSemester(): SemesterContextData {
  const context = useContext(SemesterContext);

  if (!context) {
    throw new Error('useSemester must be used within an SemesterProvider');
  }

  return context;
}

export { SemesterProvider, useSemester };
