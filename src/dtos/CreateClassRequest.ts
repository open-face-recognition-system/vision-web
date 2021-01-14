export default interface CreateClassRequest {
  startHour: Date | null;
  endHour: Date | null;
  date: Date | null;
  subjectId: number;
  semesterId: number;
}
