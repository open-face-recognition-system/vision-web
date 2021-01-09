import React, { useCallback, useState } from 'react';

import Grid from '@material-ui/core/Grid';

import { useSemester } from '../../../hooks/semester';
import { useSnack } from '../../../hooks/snackbar';

import CreateSemesterRequest from '../../../dtos/CreateSemesterRequest';

import SemesterForm from '../components/SemesterForm';
import Container from '../../../components/Container';

const CreateSemester: React.FC = () => {
  const { openSnack } = useSnack();
  const { createSemester } = useSemester();

  const [loading, setLoading] = useState(false);

  const handleCreateSemester = useCallback(
    async ({ startDate, endDate }: CreateSemesterRequest) => {
      setLoading(true);
      try {
        await createSemester({
          startDate,
          endDate,
        });
        openSnack({
          type: 'success',
          title: 'Sucesso ao criar semestre',
          open: true,
        });
      } catch (err) {
        openSnack({
          type: 'error',
          title: 'Erro ao criar semestre',
          open: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [createSemester, openSnack],
  );

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SemesterForm
            title="Criar semestre"
            actionTitle="Criar"
            clearAllFields
            defaultSemester={null}
            handleForm={handleCreateSemester}
            handleFormLoading={loading}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateSemester;
