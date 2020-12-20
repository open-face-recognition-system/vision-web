import React, { useCallback, useState } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { UserRequest, useStudent } from '../../../hooks/student';

import { useStyles } from './styles';

const CreateStudent: React.FC = () => {
  const classes = useStyles();

  const { createStudent } = useStudent();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [enrollment, setEnrollment] = useState('');

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
                name="enrollment"
                label="Matrícula"
                value={enrollment}
                onChange={e => setEnrollment(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleStudentAction}
              >
                Criar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </main>
    </>
  );
};

export default CreateStudent;
