/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useCallback, useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';

import { useParams } from 'react-router-dom';

import { Semester, useSemester } from '../../../hooks/semester';
import { useSnack } from '../../../hooks/snackbar';

import CreateSemesterRequest from '../../../dtos/CreateSemesterRequest';

import SemesterForm from '../components/SemesterForm';
import Container from '../../../components/Container';
import GlobalLoading from '../../../components/GlobalLoading';

interface SemesterParams {
  id?: string | undefined;
}

const UpdateSemester: React.FC = () => {
  const { id } = useParams<SemesterParams>();

  const { openSnack } = useSnack();
  const { updateSemester, showSemester } = useSemester();

  const [semester, setSemester] = useState<Semester>({} as Semester);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getSemesterInfo(): Promise<void> {
      try {
        setDetailsLoading(true);
        const semesterExists = await showSemester(Number(id));
        setSemester(semesterExists);
      } catch {
        setSemester({} as Semester);
        openSnack({
          type: 'error',
          title: 'Erro ao buscar semestre',
          open: true,
        });
      } finally {
        setDetailsLoading(false);
      }
    }
    if (id) {
      getSemesterInfo();
    }
  }, [id, showSemester, openSnack]);

  const handleCreateSemester = useCallback(
    async ({ startDate, endDate }: CreateSemesterRequest) => {
      setLoading(true);
      try {
        await updateSemester(Number(id), {
          startDate, endDate
        });
        openSnack({
          type: 'success',
          title: 'Sucesso ao alterar semestre',
          open: true,
        });
      } catch (err) {
        openSnack({
          type: 'error',
          title: 'Erro ao alterar semestre',
          open: true,
        });
      } finally {
        setSemester({} as Semester);
        setLoading(false);
      }
    },
    [updateSemester, openSnack, id],
  );

  return (
    <Container>
      {detailsLoading ? (
        <GlobalLoading open={detailsLoading} />
      ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SemesterForm
                title="Alterar semestre"
                actionTitle="Alterar"
                defaultSemester={semester}
                handleForm={handleCreateSemester}
                handleFormLoading={loading}
              />
            </Grid>
          </Grid>
        )}
    </Container>
  );
};

export default UpdateSemester;
