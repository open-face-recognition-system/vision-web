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

import { useParams } from 'react-router-dom';
import { UserRequest, useStudent, Photo } from '../../../hooks/student';

import { useStyles } from './styles';

interface StudentParams {
  id?: string | undefined;
}

const CreateStudent: React.FC = () => {
  const classes = useStyles();
  const { id } = useParams<StudentParams>();

  const { createStudent, showStudent, loading } = useStudent();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [enrollment, setEnrollment] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    async function getStudentInfo(): Promise<void> {
      const {
        enrollment: studentEnrollment,
        user,
        photos: studentPhotos,
      } = await showStudent(Number(id));
      setName(user.name);
      setEmail(user.email);
      setEnrollment(studentEnrollment);
      setPhotos(studentPhotos);
    }
    if (id) {
      getStudentInfo();
    }
  }, [id, showStudent]);

  const handleStudentAction = useCallback(
    async e => {
      e.preventDefault();
      try {
        const user: UserRequest = {
          name,
          email,
        };
        await createStudent({
          enrollment,
          user,
        });
      } catch (err) {
        setName('');
        setEmail('');
        setEnrollment('');
      }
    },
    [createStudent, name, email, enrollment],
  );

  return (
    <>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Novo Aluno
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
                name="enrollment"
                label="Matrícula"
                value={enrollment}
                onChange={e => setEnrollment(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={loading}
                variant="contained"
                color="primary"
                onClick={handleStudentAction}
              >
                Criar
              </Button>
            </Grid>
          </Grid>
          <List dense className={classes.root}>
            {photos?.map(photo => {
              const labelId = `checkbox-list-secondary-label-${photo.id}`;
              return (
                <ListItem key={photo.id} button>
                  <ListItemAvatar style={{ marginRight: 24 }}>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                        <Avatar style={{ width: 80, height: 80 }} alt={`Photo n°${photo.id + 1}`} src={photo.url} />
                      )}
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={photo.updatedAt} />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </main>
    </>
  );
};

export default CreateStudent;
