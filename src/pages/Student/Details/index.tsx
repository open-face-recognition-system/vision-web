/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useEffect, useState } from 'react';

import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@material-ui/core';

import { useHistory, useParams } from 'react-router-dom';

import { format, parseISO } from 'date-fns';
import { Student, useStudent } from '../../../hooks/student';
import { useSnack } from '../../../hooks/snackbar';
import Paper from '../../../components/Paper';
import Title from '../../../components/Title';
import GlobalLoading from '../../../components/GlobalLoading';
import Container from '../../../components/Container';
import Button from '../../../components/Button';

interface StudentParams {
  id?: string | undefined;
}

const Details: React.FC = () => {
  const { id } = useParams<StudentParams>();
  const history = useHistory();

  const { openSnack } = useSnack();
  const { showStudent } = useStudent();

  const [student, setStudent] = useState<Student>({} as Student);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    async function getStudentInfo(): Promise<void> {
      try {
        setDetailsLoading(true);
        const studentExists = await showStudent(Number(id));
        setStudent(studentExists);
      } catch {
        setStudent({} as Student);
        openSnack({
          type: 'error',
          title: 'Erro ao buscar aluno',
          open: true,
        });
      } finally {
        setDetailsLoading(false);
      }
    }
    if (id) {
      getStudentInfo();
    }
  }, [id, showStudent, openSnack]);

  return (
    <Container>
      {detailsLoading ? (
        <GlobalLoading open={detailsLoading} />
      ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Paper>
                <Title title="Detalhes" />
                <Typography variant="subtitle2" gutterBottom>
                  Nome:
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {student?.user?.name}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  E-mail:
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {student?.user?.email}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Matrícula:
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {student?.enrollment}
                </Typography>
                <Grid
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="center"
                >
                  <Button
                    text="Voltar"
                    color="secondary"
                    variant="text"
                    onClick={() => {
                      history.goBack();
                    }}
                  />
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper>
                <Title title="Fotos" />
                <List dense>
                  {student?.photos?.map(photo => {
                    const firstDate = parseISO(String(photo.updatedAt));
                    const formattedDate = format(firstDate, 'dd/MM/yyyy');
                    return (
                      <ListItem key={photo.id} button>
                        <ListItemAvatar>
                          <Avatar alt={`Avatar n°${photo.id}`} src={photo.url} />
                        </ListItemAvatar>
                        <ListItemText
                          id={String(photo.id)}
                          primary={formattedDate}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            </Grid>
          </Grid>
        )}
    </Container>
  );
};

export default Details;
