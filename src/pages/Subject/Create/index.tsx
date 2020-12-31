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

import { useParams, useHistory } from 'react-router-dom';
import { useSubject } from '../../../hooks/subject';
import { useSnack } from '../../../hooks/snackbar';

import { useStyles } from './styles';
import { Teacher } from '../../../hooks/teacher';

interface SubjectParams {
  id?: string | undefined;
}

const CreateSubject: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { openSnack } = useSnack();

  const { id } = useParams<SubjectParams>();

  const { createSubject, showSubject } = useSubject();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [teacher, setTeacher] = useState<Teacher>({} as Teacher);

  const [isUpdate, setUpdate] = useState(id !== undefined);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          {detailsLoading ? (
            <Backdrop className={classes.backdrop} open={detailsLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  {isUpdate ? 'Detalhes' : 'Novo Aluno'}
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
      </main>
    </>
  );
};

export default CreateSubject;
