import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { Delete, Edit, ModelTraining, PersonRemove, UploadFile } from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DataTable, { RowAction } from '../components/DataTable';
import FormCard from '../components/FormCard';
import { Student, Subject, SubjectInput, students, subjects, teachers } from '../resources';
import { useAuth } from '../auth';
import { errorMessage, useNotify } from '../notify';
import useLoad from '../useLoad';
import useRecordId from '../useRecordId';

const train: RowAction<Subject> = {
  label: 'Treinar reconhecimento',
  icon: <ModelTraining />,
  confirm: 'Treinar o reconhecimento facial com as fotos atuais dos alunos matriculados?',
  success: 'Treinamento concluído',
  run: subject => subjects.train(subject.id),
};

export function SubjectList() {
  const navigate = useNavigate();
  const isAdmin = useAuth().user?.role === 'admin';

  return (
    <DataTable<Subject>
      title="Matérias"
      load={isAdmin ? subjects.list : subjects.listMine}
      onAdd={isAdmin ? () => navigate('/subjects/new') : undefined}
      columns={[
        { label: 'Nome', render: subject => subject.name },
        { label: 'Curso', render: subject => subject.course },
        { label: 'Professor', render: subject => subject.teacher?.user?.name },
        {
          label: 'Reconhecimento',
          render: subject =>
            subject.recognitionFile ? (
              <Chip color="success" size="small" label="Treinado" />
            ) : (
              <Chip color="warning" size="small" label="Não treinado" />
            ),
        },
      ]}
      actions={
        isAdmin
          ? [
              train,
              { label: 'Editar', icon: <Edit />, run: subject => navigate(`/subjects/${subject.id}/edit`) },
              {
                label: 'Excluir',
                icon: <Delete />,
                confirm: 'Deseja realmente excluir esta matéria?',
                success: 'Matéria excluída',
                run: subject => subjects.remove(subject.id),
              },
            ]
          : [train]
      }
    />
  );
}

export function SubjectForm() {
  const id = useRecordId();
  const [subject, setSubject] = useState<Partial<SubjectInput>>({ name: '', course: '', description: '' });
  const { data: teacherOptions } = useLoad(() => teachers.list({ page: 1, limit: 100 }), []);

  const { loading } = useLoad(async () => {
    if (!id) return;
    const { name, course, description, teacher } = await subjects.show(id);
    setSubject({ name, course, description, teacherId: teacher?.id });
  }, [id]);

  const field = (key: 'name' | 'course' | 'description') => ({
    value: subject[key] ?? '',
    onChange: (event: ChangeEvent<HTMLInputElement>) => setSubject({ ...subject, [key]: event.target.value }),
  });

  const save = () => {
    const input = subject as SubjectInput;
    return id ? subjects.update(id, input) : subjects.create(input);
  };

  const form = (
    <FormCard
      title={id ? 'Alterar matéria' : 'Nova matéria'}
      loading={loading && id !== null}
      onSubmit={save}
      success={id ? 'Matéria alterada' : 'Matéria criada'}
    >
      <TextField label="Nome" required {...field('name')} />
      <TextField label="Curso" required {...field('course')} />
      <TextField
        select
        label="Professor"
        required
        value={subject.teacherId ?? ''}
        onChange={event => setSubject({ ...subject, teacherId: Number(event.target.value) })}
      >
        {teacherOptions?.data.map(teacher => (
          <MenuItem key={teacher.id} value={teacher.id}>
            {teacher.user.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField label="Descrição" required multiline minRows={2} {...field('description')} />
    </FormCard>
  );

  if (!id) return form;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>{form}</Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Enrollments subjectId={id} />
      </Grid>
    </Grid>
  );
}

function Enrollments({ subjectId }: { subjectId: number }) {
  const navigate = useNavigate();
  const notify = useNotify();
  const [candidate, setCandidate] = useState<Student | null>(null);
  const [search, setSearch] = useState('');
  const { data: subject, reload } = useLoad(() => subjects.show(subjectId), [subjectId]);
  const { data: options } = useLoad(() => students.list({ page: 1, limit: 20, ...(search && { name: search }) }), [search]);

  const enrolled = subject?.students?.filter(enrollment => enrollment.isEnrolled) ?? [];

  const attempt = async (action: () => Promise<unknown>, success: string, failure: string) => {
    try {
      await action();
      notify(success);
      await reload();
    } catch (error) {
      notify(errorMessage(error, failure), 'error');
    }
  };

  const importPdf = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) attempt(() => subjects.enrollFromPdf(subjectId, file), 'Alunos matriculados', 'Erro ao importar PDF');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Alunos matriculados ({enrolled.length})
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Autocomplete
          sx={{ flexGrow: 1 }}
          options={options?.data ?? []}
          value={candidate}
          getOptionLabel={student => `${student.user.name} (${student.enrollment})`}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_, student) => setCandidate(student)}
          onInputChange={(_, text) => setSearch(text)}
          renderInput={params => <TextField {...params} label="Aluno" size="small" />}
        />
        <Button
          variant="contained"
          disabled={!candidate}
          onClick={() =>
            attempt(
              () => subjects.enroll(subjectId, candidate!.id).then(() => setCandidate(null)),
              'Aluno matriculado',
              'Erro ao matricular aluno',
            )
          }
        >
          Matricular
        </Button>
      </Stack>
      <Button component="label" variant="outlined" startIcon={<UploadFile />}>
        Importar PDF de matrícula
        <input hidden type="file" accept="application/pdf" onChange={importPdf} />
      </Button>
      <List dense>
        {enrolled.map(({ student }) => (
          <ListItem
            key={student.id}
            disablePadding
            secondaryAction={
              <IconButton
                edge="end"
                aria-label={`Desmatricular ${student.user.name}`}
                onClick={() =>
                  attempt(() => subjects.unenroll(subjectId, student.id), 'Aluno desmatriculado', 'Erro ao desmatricular aluno')
                }
              >
                <PersonRemove />
              </IconButton>
            }
          >
            <ListItemButton onClick={() => navigate(`/students/${student.id}`)}>
              <ListItemText primary={student.user.name} secondary={`${student.photos?.length ?? 0} fotos`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
