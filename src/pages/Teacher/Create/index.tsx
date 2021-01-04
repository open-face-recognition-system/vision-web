import React, { useCallback, useState } from 'react';

import Grid from '@material-ui/core/Grid';

import { UserRequest, useTeacher } from '../../../hooks/teacher';
import { useSnack } from '../../../hooks/snackbar';

import CreateTeacherRequest from '../../../dtos/CreateTeacherRequest';

import TeacherForm from '../components/TeacherForm';
import Container from '../../../components/Container';

const CreateTeacher: React.FC = () => {
  const { openSnack } = useSnack();

  const { createTeacher } = useTeacher();

  const [loading, setLoading] = useState(false);

  const handleCreateTeacher = useCallback(
    async ({ name, email, enrollment }: CreateTeacherRequest) => {
      setLoading(true);
      try {
        const user: UserRequest = {
          name,
          email,
        };
        await createTeacher({
          enrollment,
          user,
        });
        openSnack({
          type: 'success',
          title: 'Sucesso ao criar professor',
          open: true,
        });
      } catch (err) {
        openSnack({
          type: 'error',
          title: 'Erro ao criar professor',
          open: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [createTeacher, openSnack],
  );

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TeacherForm
            title="Criar professor"
            actionTitle="Criar"
            clearAllFields
            handleForm={handleCreateTeacher}
            handleFormLoading={loading}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateTeacher;
