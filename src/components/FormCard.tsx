import { FormEvent, PropsWithChildren, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { errorMessage, useNotify } from '../notify';

interface FormCardProps {
  title: string;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: () => Promise<unknown>;
  success: string;
  extraActions?: ReactNode;
}

export default function FormCard({
  title,
  loading,
  submitLabel = 'Salvar',
  onSubmit,
  success,
  extraActions,
  children,
}: PropsWithChildren<FormCardProps>) {
  const navigate = useNavigate();
  const notify = useNotify();
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit();
      notify(success);
      navigate(-1);
    } catch (error) {
      notify(errorMessage(error, 'Erro ao salvar'), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper component="form" onSubmit={submit} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height: 4, mb: 2 }}>{(loading || saving) && <LinearProgress />}</Box>
      <Stack spacing={2}>{children}</Stack>
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button type="submit" variant="contained" disabled={loading || saving}>
          {submitLabel}
        </Button>
        {extraActions}
        <Box sx={{ flexGrow: 1 }} />
        <Button color="secondary" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
      </Stack>
    </Paper>
  );
}
