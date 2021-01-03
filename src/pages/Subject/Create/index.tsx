import React, { useCallback, useState } from 'react';

import Grid from '@material-ui/core/Grid';

import { useSubject } from '../../../hooks/subject';
import { useSnack } from '../../../hooks/snackbar';

import CreateSubjectRequest from '../../../dtos/CreateSubjectRequest';

import SubjectForm from '../components/SubjectForm';
import Container from '../../../components/Container';

const CreateSubject: React.FC = () => {
  const { openSnack } = useSnack();
  const { createSubject } = useSubject();

  const [loading, setLoading] = useState(false);

  const handleCreateSubject = useCallback(
    async ({ name, course, description, teacherId }: CreateSubjectRequest) => {
      setLoading(true);
      try {
        await createSubject({
          name,
          course,
          description,
          teacherId,
        });
        openSnack({
          type: 'success',
          title: 'Sucesso ao criar matérias',
          open: true,
        });
      } catch (err) {
        openSnack({
          type: 'error',
          title: 'Erro ao criar matérias',
          open: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [createSubject, openSnack],
  );

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SubjectForm
            title="Criar matéria"
            actionTitle="Criar"
            clearAllFields
            handleForm={handleCreateSubject}
            handleFormLoading={loading}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateSubject;
