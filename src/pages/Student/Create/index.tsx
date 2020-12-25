/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useCallback, useEffect, useState } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop'

import { useParams, useHistory } from 'react-router-dom';
import { UserRequest, useStudent, Photo } from '../../../hooks/student';
import { useSnack } from '../../../hooks/snackbar';

import { useStyles } from './styles';

interface StudentParams {
  id?: string | undefined;
}

const CreateStudent: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { openSnack } = useSnack();

  const { id } = useParams<StudentParams>();

  const { createStudent, showStudent } = useStudent();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [enrollment, setEnrollment] = useState('');

  const [photos, setPhotos] = useState<Photo[]>([]);

  const [isUpdate, setUpdate] = useState(id !== undefined);
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getStudentInfo(): Promise<void> {
      try {
        setDetailsLoading(true)
        const {
          enrollment: studentEnrollment,
          user,
          photos: studentPhotos,
        } = await showStudent(Number(id));
        setName(user.name);
        setEmail(user.email);
        setEnrollment(studentEnrollment);
        setPhotos(studentPhotos);
      } catch {
        setUpdate(false)
        setName('');
        setEmail('');
        setEnrollment('');
        openSnack({
          type: 'error',
          title: 'Erro ao buscar aluno',
          open: true,
        });
      } finally {
        setDetailsLoading(false)
      }
    }
    if (id) {
      getStudentInfo();
      setUpdate(true)
    } else {
      setUpdate(false)
    }
  }, [id, showStudent, openSnack]);

  const handleStudentAction = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true)
      try {
        const user: UserRequest = {
          name,
          email,
        };
        await createStudent({
          enrollment,
          user,
        });
        openSnack({
          type: 'success',
          title: 'Sucesso ao criar aluno',
          open: true,
        });
      } catch (err) {
        openSnack({
          type: 'error',
          title: 'Erro ao criar aluno',
          open: true,
        });
      } finally {
        setName('');
        setEmail('');
        setEnrollment('');
        setLoading(false)
      }
    },
    [createStudent, name, email, enrollment, openSnack],
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
                    {isUpdate ? "Detalhes" : "Novo Aluno"}
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
                              onClick={handleStudentAction}
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
                  <List dense className={classes.root}>
                    {photos?.map(photo => {
                      const labelId = `checkbox-list-secondary-label-${photo.id}`;
                      return (
                        <ListItem key={photo.id} button>
                          <ListItemAvatar style={{ marginRight: 24 }}>
                            <Avatar style={{ width: 80, height: 80 }} alt={`Photo n°${photo.id + 1}`} src={photo.url} />
                          </ListItemAvatar>
                          <ListItemText id={labelId} primary={photo.updatedAt} />
                        </ListItem>
                      );
                    })}
                  </List>
                </>
              )
          }

        </Paper>
      </main>
    </>
  );
};

export default CreateStudent;
