import { format, parseISO } from 'date-fns';

// Semester and class dates are calendar days: read and send them without a time zone.
export const parseDate = (iso: string) => parseISO(iso.slice(0, 10));
export const formatDate = (iso: string) => format(parseDate(iso), 'dd/MM/yyyy');
export const toDateOnly = (date: Date) => format(date, 'yyyy-MM-dd');

export const formatTime = (iso: string) => format(parseISO(iso), 'HH:mm');
export const formatTimestamp = (iso: string) => format(parseISO(iso), 'dd/MM/yyyy');
export const formatPeriod = ({ startDate, endDate }: { startDate: string; endDate: string }) =>
  `${formatDate(startDate)} - ${formatDate(endDate)}`;
