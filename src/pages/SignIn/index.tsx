/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useCallback } from 'react';
import {
  Button,
  CssBaseline,
  TextField as MaterialTextField,
  Typography,
  Container,
  CircularProgress,
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

        history.push('/dashboard');
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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
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
          {loading ? (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className={classes.button}
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
                className={classes.button}
              >
                Entrar
              </Button>
            )}
        </form>
      </div>
    </Container>
  );
};

export default SignIn;
