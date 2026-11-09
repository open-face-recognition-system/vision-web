import { useNavigate, useParams } from 'react-router';
import { Box, Button, ImageList, ImageListItem, ImageListItemBar, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { students } from '../resources';
import { formatTimestamp } from '../format';
import useLoad from '../useLoad';

export default function StudentDetails() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const { data: student, loading } = useLoad(() => students.show(id), [id]);

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ height: 4, mb: 1 }}>{loading && <LinearProgress />}</Box>
        <Typography variant="h6">{student?.user.name}</Typography>
        <Typography color="text.secondary">{student?.user.email}</Typography>
        <Typography color="text.secondary">Matrícula {student?.enrollment}</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Fotos ({student?.photos?.length ?? 0})
        </Typography>
        {student?.photos?.length === 0 && (
          <Typography color="text.secondary">O aluno ainda não enviou fotos pelo aplicativo.</Typography>
        )}
        <ImageList cols={6} gap={8}>
          {(student?.photos ?? []).map(photo => (
            <ImageListItem key={photo.id}>
              <img src={photo.url} alt={`Foto ${photo.photoType}`} loading="lazy" />
              <ImageListItemBar title={photo.photoType} subtitle={formatTimestamp(photo.updatedAt)} />
            </ImageListItem>
          ))}
        </ImageList>
      </Paper>
    </Stack>
  );
}
