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
import Backdrop from '@material-ui/core/Backdrop'

import { useParams, useHistory } from 'react-router-dom';
import { UserRequest, useTeacher } from '../../../hooks/teacher';
import { useSnack } from '../../../hooks/snackbar';

import { useStyles } from './styles';

interface TeacherParams {
  id?: string | undefined;
}

const CreateTeacher: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { openSnack } = useSnack();

  const { id } = useParams<TeacherParams>();

  const { createTeacher, showTeacher } = useTeacher();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [enrollment, setEnrollment] = useState('');

  const [isUpdate, setUpdate] = useState(id !== undefined);
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getTeacherInfo(): Promise<void> {
      try {
        setDetailsLoading(true)
        const {
          enrollment: teacherEnrollment,
          user,
        } = await showTeacher(Number(id));
        setName(user.name);
        setEmail(user.email);
        setEnrollment(teacherEnrollment);
      } catch {
        setUpdate(false)
        setName('');
        setEmail('');
        setEnrollment('');
        openSnack({
          type: 'error',
          title: 'Erro ao buscar professor',
          open: true,
        });
      } finally {
        setDetailsLoading(false)
      }
    }
    if (id) {
      getTeacherInfo();
      setUpdate(true)
    } else {
      setUpdate(false)
    }
  }, [id, showTeacher, openSnack]);

  const handleTeacherAction = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true)
      try {
        const user: UserRequest = {
          name,
          email,
        };
        await createTeacher({
          enrollment,
          user,
        });
        openSnack({
          type: 'success',
          title: 'Sucesso ao criar professor',
          open: true,
        });
      } catch (err) {
        openSnack({
          type: 'error',
          title: 'Erro ao criar professor',
          open: true,
        });
      } finally {
        setName('');
        setEmail('');
        setEnrollment('');
        setLoading(false)
      }
    },
    [createTeacher, name, email, enrollment, openSnack],
  );

  return (
    <>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          {
            detailsLoading ? (
              <Backdrop className={classes.backdrop} open={detailsLoading}>
                <CircularProgress color="inherit" />
              </Backdrop>
            ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    {isUpdate ? "Detalhes" : "Novo Professor"}
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
                        id="email"
                        name="email"
                        label="E-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="enrollment"
                        disabled={isUpdate}
                        name="enrollment"
                        label="Matrícula"
                        value={enrollment}
                        onChange={e => setEnrollment(e.target.value)}
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
                              onClick={handleTeacherAction}
                              className={classes.createButton}
                            >
                              {isUpdate ? "Alterar" : "Criar"}
                            </Button>
                          )}
                        <Button
                          color="secondary"
                          onClick={
                            () => {
                              history.goBack()
                            }
                          }
                        >Cancelar
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )
          }
        </Paper>
      </main>
    </>
  );
};

export default CreateTeacher;
