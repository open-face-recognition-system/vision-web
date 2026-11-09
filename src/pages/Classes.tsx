import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Delete, Download, Edit, Refresh } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { parseISO } from 'date-fns';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import FormCard from '../components/FormCard';
import { Attendance, ClassItem, classes, semesters, subjects } from '../resources';
import { useAuth } from '../auth';
import { errorMessage, useNotify } from '../notify';
import { formatDate, formatPeriod, formatTime, parseDate, toDateOnly } from '../format';
import useLoad from '../useLoad';
import useRecordId from '../useRecordId';

export function ClassList() {
  const navigate = useNavigate();
  const isAdmin = useAuth().user?.role === 'admin';

  return (
    <DataTable<ClassItem>
      title="Aulas"
      load={isAdmin ? classes.list : classes.listMine}
      onAdd={isAdmin ? () => navigate('/classes/new') : undefined}
      onRowClick={lecture => navigate(`/classes/${lecture.id}/attendances`)}
      columns={[
        { label: 'Data', render: lecture => formatDate(lecture.date) },
        { label: 'Horário', render: lecture => `${formatTime(lecture.startHour)} - ${formatTime(lecture.endHour)}` },
        { label: 'Matéria', render: lecture => lecture.subject?.name },
      ]}
      actions={
        isAdmin
          ? [
              { label: 'Editar', icon: <Edit />, run: lecture => navigate(`/classes/${lecture.id}/edit`) },
              {
                label: 'Excluir',
                icon: <Delete />,
                confirm: 'Deseja realmente excluir esta aula e sua lista de presença?',
                success: 'Aula excluída',
                run: lecture => classes.remove(lecture.id),
              },
            ]
          : []
      }
    />
  );
}

interface ClassDraft {
  date: Date | null;
  startHour: Date | null;
  endHour: Date | null;
  subjectId?: number;
  semesterId?: number;
}

export function ClassForm() {
  const id = useRecordId();
  const [draft, setDraft] = useState<ClassDraft>({ date: null, startHour: null, endHour: null });
  const { data: subjectOptions } = useLoad(() => subjects.list({ page: 1, limit: 100 }), []);
  const { data: semesterOptions } = useLoad(() => semesters.list({ page: 1, limit: 100 }), []);

  const { loading } = useLoad(async () => {
    if (!id) return;
    const lecture = await classes.show(id);
    setDraft({
      date: parseDate(lecture.date),
      startHour: parseISO(lecture.startHour),
      endHour: parseISO(lecture.endHour),
      subjectId: lecture.subject?.id,
      semesterId: lecture.semester?.id,
    });
  }, [id]);

  const save = () => {
    const { date, startHour, endHour, subjectId, semesterId } = draft as Required<{ [K in keyof ClassDraft]: NonNullable<ClassDraft[K]> }>;
    const input = { date: toDateOnly(date), startHour, endHour, subjectId, semesterId };
    return id ? classes.update(id, input) : classes.create(input);
  };

  const required = { textField: { required: true } };

  return (
    <FormCard
      title={id ? 'Alterar aula' : 'Nova aula'}
      loading={loading && id !== null}
      onSubmit={save}
      success={id ? 'Aula alterada' : 'Aula criada'}
    >
      <DatePicker label="Data" value={draft.date} onChange={date => setDraft({ ...draft, date })} slotProps={required} />
      <TimePicker
        label="Início"
        ampm={false}
        value={draft.startHour}
        onChange={startHour => setDraft({ ...draft, startHour })}
        slotProps={required}
      />
      <TimePicker
        label="Fim"
        ampm={false}
        value={draft.endHour}
        onChange={endHour => setDraft({ ...draft, endHour })}
        slotProps={required}
      />
      <TextField
        select
        label="Matéria"
        required
        value={draft.subjectId ?? ''}
        onChange={event => setDraft({ ...draft, subjectId: Number(event.target.value) })}
      >
        {subjectOptions?.data.map(subject => (
          <MenuItem key={subject.id} value={subject.id}>
            {subject.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Semestre"
        required
        value={draft.semesterId ?? ''}
        onChange={event => setDraft({ ...draft, semesterId: Number(event.target.value) })}
      >
        {semesterOptions?.data.map(semester => (
          <MenuItem key={semester.id} value={semester.id}>
            {formatPeriod(semester)}
          </MenuItem>
        ))}
      </TextField>
    </FormCard>
  );
}

function downloadCsv(attendances: Attendance[], lectureId: number) {
  const lines = [
    ['Aluno', 'Matrícula', 'Presença'],
    ...attendances.map(({ student, isPresent }) => [student.user.name, student.enrollment, isPresent ? 'Presente' : 'Ausente']),
  ].map(columns => columns.map(value => `"${value.replaceAll('"', '""')}"`).join(','));
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([`﻿${lines.join('\n')}`], { type: 'text/csv' }));
  link.download = `presenca-aula-${lectureId}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function AttendanceList() {
  const lectureId = Number(useParams().id);
  const notify = useNotify();
  const [pending, setPending] = useState<Attendance | null>(null);
  const { data: attendances, loading, reload } = useLoad(() => classes.attendances(lectureId), [lectureId]);

  const toggle = async (attendance: Attendance) => {
    setPending(null);
    try {
      await classes.setPresence(lectureId, attendance, !attendance.isPresent);
      notify('Presença alterada');
      await reload();
    } catch (error) {
      notify(errorMessage(error, 'Erro ao alterar presença'), 'error');
    }
  };

  const present = attendances?.filter(attendance => attendance.isPresent).length ?? 0;

  return (
    <Paper>
      <Toolbar sx={{ gap: 1 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Lista de presença ({present}/{attendances?.length ?? 0})
        </Typography>
        <Button startIcon={<Refresh />} onClick={reload}>
          Atualizar
        </Button>
        <Button startIcon={<Download />} disabled={!attendances?.length} onClick={() => downloadCsv(attendances!, lectureId)}>
          CSV
        </Button>
      </Toolbar>
      <Box sx={{ height: 4 }}>{loading && <LinearProgress />}</Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Aluno</TableCell>
            <TableCell>Matrícula</TableCell>
            <TableCell>Presença</TableCell>
            <TableCell align="right">Alterar manualmente</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendances?.map(attendance => (
            <TableRow key={attendance.id}>
              <TableCell>{attendance.student.user.name}</TableCell>
              <TableCell>{attendance.student.enrollment}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={attendance.isPresent ? 'success' : 'default'}
                  label={attendance.isPresent ? 'Presente' : 'Ausente'}
                />
              </TableCell>
              <TableCell align="right">
                <Switch
                  checked={attendance.isPresent}
                  onChange={() => setPending(attendance)}
                  slotProps={{ input: { 'aria-label': `Presença de ${attendance.student.user.name}` } }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ConfirmDialog
        open={pending !== null}
        title="Alterar presença"
        description={`Marcar ${pending?.student.user.name} como ${pending?.isPresent ? 'ausente' : 'presente'}?`}
        onCancel={() => setPending(null)}
        onConfirm={() => pending && toggle(pending)}
      />
    </Paper>
  );
}
