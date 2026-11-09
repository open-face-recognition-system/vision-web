import api, { User } from './api';

export interface Page<T> {
  total: number;
  data: T[];
}

export interface PageQuery {
  page: number;
  limit: number;
  name?: string;
}

export interface Photo {
  id: number;
  url: string;
  photoType: string;
  updatedAt: string;
}

export interface Student {
  id: number;
  enrollment: string;
  user: User;
  photos?: Photo[];
}

export interface Teacher {
  id: number;
  enrollment: string;
  user: User;
}

export interface Semester {
  id: number;
  startDate: string;
  endDate: string;
}

export interface Enrollment {
  isEnrolled: boolean;
  student: Student;
}

export interface Subject {
  id: number;
  name: string;
  course: string;
  description: string;
  teacher: Teacher;
  recognitionFile: { id: number } | null;
  students?: Enrollment[];
}

export interface ClassItem {
  id: number;
  startHour: string;
  endHour: string;
  date: string;
  subject: Subject;
  semester: Semester;
}

export interface Attendance {
  id: number;
  isPresent: boolean;
  student: Student;
}

export interface PersonInput {
  name: string;
  email: string;
  enrollment: string;
  password?: string;
}

export interface SemesterInput {
  startDate: string;
  endDate: string;
}

export interface SubjectInput {
  name: string;
  course: string;
  description: string;
  teacherId: number;
}

export interface ClassInput {
  startHour: Date;
  endHour: Date;
  date: string;
  subjectId: number;
  semesterId: number;
}

const get = async <T>(url: string, params?: object) => (await api.get<T>(url, { params })).data;
const send = async <T>(method: 'post' | 'put', url: string, body?: unknown) => (await api[method]<T>(url, body)).data;

function resource<T, Input>(path: string) {
  return {
    list: (query: PageQuery) => get<Page<T>>(path, query),
    show: (id: number) => get<T>(`${path}/${id}`),
    create: (input: Input) => send<T>('post', path, input),
    update: (id: number, input: Input) => send<T>('put', `${path}/${id}`, input),
    remove: async (id: number) => void (await api.delete(`${path}/${id}`)),
  };
}

export const semesters = resource<Semester, SemesterInput>('/semesters');

export const students = {
  ...resource<Student, PersonInput>('/students'),
  update: (id: number, { name, email }: PersonInput) => send<Student>('put', `/students/${id}`, { name, email }),
  remove: async (student: Student) => void (await api.delete(`/users/${student.user.id}`)),
};

export const teachers = {
  ...resource<Teacher, PersonInput>('/teachers'),
  update: (id: number, { name, email }: PersonInput) => send<Teacher>('put', `/teachers/${id}`, { name, email }),
  remove: async (teacher: Teacher) => void (await api.delete(`/users/${teacher.user.id}`)),
};

export const subjects = {
  ...resource<Subject, SubjectInput>('/subjects'),
  listMine: (query: PageQuery) => get<Page<Subject>>('/subjects/teacher', query),
  enroll: (id: number, studentId: number) => send<Student>('post', `/subjects/${id}/enroll`, { studentId }),
  unenroll: (id: number, studentId: number) => send<void>('post', `/subjects/${id}/unenroll`, { studentId }),
  enrollFromPdf: (id: number, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return send<Student[]>('post', `/subjects/${id}/enroll/pdf`, form);
  },
  train: (id: number) => send<void>('post', `/recognition/training/${id}`),
};

export const classes = {
  ...resource<ClassItem, ClassInput>('/classes'),
  listMine: (query: PageQuery) => get<Page<ClassItem>>('/classes/teacher', query),
  attendances: (id: number) => get<Attendance[]>(`/attendances/class/${id}`),
  setPresence: (lectureId: number, attendance: Attendance, isPresent: boolean) =>
    send<Attendance>('put', `/attendances/${attendance.id}`, {
      classId: lectureId,
      studentId: attendance.student.id,
      isPresent,
    }),
};
