/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useCallback } from 'react';
import {
  Button,
  CssBaseline,
  TextField as MaterialTextField,
  Typography,
  Grid,
  CircularProgress,
  Paper
} from '@material-ui/core';

import { useHistory } from 'react-router-dom';
import { useStyles } from './styles';

import { useAuth } from '../../hooks/auth';
import { useSnack } from '../../hooks/snackbar';

import TextField from '../../components/TextField'

const SignIn: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { openSnack } = useSnack();
  const { signIn } = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();
      try {
        setLoading(true)
        await signIn({
          email,
          password,
        });
        setLoading(false)

        history.push('/classes');
      } catch (err) {
        setEmail('');
        setPassword('');
        setLoading(false)
        openSnack({
          type: 'error',
          title: 'Erro na autenticação',
          open: true,
        });
      }
    },
    [signIn, history, email, password, openSnack],
  );

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Faça seu login
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              label="E-mail"
              name="email"
              value={email}
              disabled={false}
              setValue={setEmail}
            />
            <MaterialTextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </form>
          {loading ? (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              <CircularProgress size={14} />
            </Button>

          ) : (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Entrar
              </Button>
            )}
        </div>
      </Grid>
    </Grid>
  );
};

export default SignIn;
