import React, { useCallback } from 'react';
import {
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useStyles } from './styles';

import { useAuth } from '../../hooks/auth';

const SignIn: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { signIn } = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();
      try {
        await signIn({
          email,
          password,
        });

        history.push('/dashboard');
      } catch (err) {
        console.log(err);
        setEmail('');
        setPassword('');
      }
    },
    [signIn, history, email, password],
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
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className={classes.button}
          >
            Entrar
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default SignIn;
