import React, { useCallback, useState } from 'react';

import Grid from '@material-ui/core/Grid';

import { UserRequest, useStudent } from '../../../hooks/student';
import { useSnack } from '../../../hooks/snackbar';

import CreateStudentRequest from '../../../dtos/CreateStudentRequest';

import StudentForm from '../components/StudentForm';
import Container from '../../../components/Container';

const CreateStudent: React.FC = () => {
  const { openSnack } = useSnack();

  const { createStudent } = useStudent();

  const [loading, setLoading] = useState(false);

  const handleCreateStudent = useCallback(
    async ({ name, email, enrollment }: CreateStudentRequest) => {
      setLoading(true);
      try {
        const user: UserRequest = {
          name,
          email,
        };
        await createStudent({
          enrollment,
          user,
        });
        openSnack({
          type: 'success',
          title: 'Sucesso ao criar aluno',
          open: true,
        });
      } catch (err) {
        openSnack({
          type: 'error',
          title: 'Erro ao criar aluno',
          open: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [createStudent, openSnack],
  );

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StudentForm
            title="Criar aluno"
            actionTitle="Criar"
            clearAllFields
            handleForm={handleCreateStudent}
            handleFormLoading={loading}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateStudent;
