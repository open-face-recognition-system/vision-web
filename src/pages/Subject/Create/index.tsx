/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useCallback, useEffect, useState } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { useParams, useHistory } from 'react-router-dom';
import { Autocomplete } from '@material-ui/lab';
import { useSubject } from '../../../hooks/subject';
import { useSnack } from '../../../hooks/snackbar';

import { useStyles } from './styles';
import { Teacher, useTeacher } from '../../../hooks/teacher';
import { Student, useStudent } from '../../../hooks/student';

interface SubjectParams {
  id?: string | undefined;
}

const CreateSubject: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { openSnack } = useSnack();

  const { listTeachers } = useTeacher();
  const { listStudents } = useStudent();

  const { id } = useParams<SubjectParams>();

  const { createSubject, showSubject } = useSubject();

  const [open, setOpen] = useState(false);
  const [openStudent, setOpenStudent] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [teacher, setTeacher] = useState<Teacher>({} as Teacher);

  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [students, setStudents] = useState<Student[]>([]);

  const [isUpdate, setUpdate] = useState(id !== undefined);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setTeachers([]);
    }
  }, [open]);

  useEffect(() => {
    async function getSubjectInfo(): Promise<void> {
      try {
        setDetailsLoading(true);
        const subject = await showSubject(Number(id));
        setName(subject.name);
        setCourse(subject.course);
        setDescription(subject.description);
        setTeacher(subject.teacher);
      } catch {
        setUpdate(false);
        setName('');
        setCourse('');
        setDescription('');
        setTeacher({} as Teacher);
        openSnack({
          type: 'error',
          title: 'Erro ao buscar matérias',
          open: true,
        });
      } finally {
        setDetailsLoading(false);
      }
    }
    if (id) {
      getSubjectInfo();
      setUpdate(true);
    } else {
      setUpdate(false);
    }
  }, [id, showSubject, openSnack]);

  const handleSubjectAction = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      try {
        await createSubject({
          name,
          course,
          description,
          teacherId: teacher.id,
        });
        openSnack({
          type: 'success',
          title: 'Sucesso ao criar matérias',
          open: true,
        });
      } catch (err) {
        openSnack({
          type: 'error',
          title: 'Erro ao criar matérias',
          open: true,
        });
      } finally {
        setName('');
        setCourse('');
        setDescription('');
        setTeacher({} as Teacher);
        setLoading(false);
      }
    },
    [createSubject, name, course, description, teacher.id, openSnack],
  );

  const handleChangeTeacher = useCallback(
    async e => {
      const teacherName = e.target.value;
      if (teacherName) {
        const query = {
          name: teacherName,
        };
        setTeachersLoading(true);
        const teachersResponse = await listTeachers(
          {
            page: 1,
            per_page: 100,
          },
          query,
        );
        setTeachersLoading(false);
        setTeachers(teachersResponse.data);
      }
    },
    [listTeachers],
  );

  const handleChangeStudent = useCallback(
    async e => {
      const studentName = e.target.value;
      if (studentName) {
        const query = {
          name: studentName,
        };
        setStudentsLoading(true);
        const studentsResponse = await listStudents(
          {
            page: 1,
            per_page: 100,
          },
          query,
        );
        setStudentsLoading(false);
        setStudents(studentsResponse.data);
      }
    },
    [listStudents],
  );

  return (
    <>
      <CssBaseline />
      <main className={classes.layout}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              {detailsLoading ? (
                <Backdrop className={classes.backdrop} open={detailsLoading}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              ) : (
                  <>
                    <Typography variant="h6" gutterBottom>
                      {isUpdate ? 'Detalhes' : 'Nova Matéria'}
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          required
                          disabled={isUpdate}
                          id="name"
                          name="name"
                          label="Nome"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          disabled={isUpdate}
                          id="course"
                          name="course"
                          label="Curso"
                          value={course}
                          onChange={e => setCourse(e.target.value)}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Autocomplete
                          open={open}
                          onOpen={() => {
                            setOpen(true);
                          }}
                          onClose={() => {
                            setOpen(false);
                          }}
                          getOptionSelected={(option, value) => {
                            const selectedTeacher = option.id === value.id;
                            if (selectedTeacher) {
                              setTeacher(value);
                              return selectedTeacher;
                            }
                            return false;
                          }}
                          defaultValue={teacher}
                          getOptionLabel={option => option.user?.name}
                          options={teachers}
                          disabled={isUpdate}
                          loading={teachersLoading}
                          renderInput={params => (
                            <TextField
                              {...params}
                              id="teacher"
                              name="teacher"
                              label="Professor"
                              disabled={isUpdate}
                              fullWidth
                              onChange={e => handleChangeTeacher(e)}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {teachersLoading ? (
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          disabled={isUpdate}
                          id="description"
                          name="description"
                          label="Descrição"
                          multiline
                          rows={4}
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid
                          container
                          direction="row"
                          justify="flex-end"
                          alignItems="center"
                        >
                          {loading ? (
                            <Button
                              variant="contained"
                              color="primary"
                              className={classes.createButton}
                              disabled={isUpdate}
                            >
                              <CircularProgress size={14} />
                            </Button>
                          ) : (
                              <Button
                                disabled={isUpdate}
                                variant="contained"
                                color="primary"
                                onClick={handleSubjectAction}
                                className={classes.createButton}
                              >
                                {isUpdate ? 'Alterar' : 'Criar'}
                              </Button>
                            )}
                          <Button
                            color="secondary"
                            onClick={() => {
                              history.goBack();
                            }}
                          >
                            Cancelar
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Typography variant="h6" gutterBottom>
                Alunos matriculados
              </Typography>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item xs={12} sm={9}>
                  <Autocomplete
                    open={openStudent}
                    onOpen={() => {
                      setOpenStudent(true);
                    }}
                    onClose={() => {
                      setOpenStudent(false);
                    }}
                    getOptionSelected={(option, value) => {
                      const selectedStudent = option.id === value.id;
                      if (selectedStudent) {
                        return selectedStudent;
                      }
                      return false;
                    }}
                    getOptionLabel={option => option.user?.name}
                    options={students}
                    loading={studentsLoading}
                    renderInput={params => (
                      <TextField
                        {...params}
                        id="student"
                        name="student"
                        label="Aluno"
                        fullWidth
                        onChange={e => handleChangeStudent(e)}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {studentsLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubjectAction}
                    style={{ marginLeft: 16 }}
                  >
                    Matricular
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.studentListContainer}>
                  <List>
                    <ListItem
                      button
                      onClick={() => {
                        console.log("clicked");
                      }}
                    >
                      <ListItemText primary="Single-line item" />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </div>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </main>
    </>
  );
};

export default CreateSubject;
