import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from '../auth';
import { errorMessage, useNotify } from '../notify';

export default function SignIn() {
  const { signIn } = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/classes');
    } catch (error) {
      setPassword('');
      notify(errorMessage(error, 'Erro na autenticação'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'primary.dark', p: 2 }}>
      <Paper component="form" onSubmit={submit} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ letterSpacing: 4, textAlign: 'center' }}>
            VISION
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center' }}>
            Faça seu login
          </Typography>
          <TextField
            label="E-mail"
            type="email"
            autoComplete="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />
          <TextField
            label="Senha"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
