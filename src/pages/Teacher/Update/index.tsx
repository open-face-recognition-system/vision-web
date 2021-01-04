/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useCallback, useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';

import { useParams } from 'react-router-dom';

import { Teacher, useTeacher } from '../../../hooks/teacher';
import { useSnack } from '../../../hooks/snackbar';

import CreateTeacherRequest from '../../../dtos/CreateTeacherRequest';

import TeacherForm from '../components/TeacherForm';
import Container from '../../../components/Container';
import GlobalLoading from '../../../components/GlobalLoading';

interface TeacherParams {
  id?: string | undefined;
}

const UpdateTeacher: React.FC = () => {
  const { id } = useParams<TeacherParams>();

  const { openSnack } = useSnack();
  // const { updateTeacher, showTeacher } = useTeacher();

  const [teacher, setTeacher] = useState<Teacher>({} as Teacher);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   async function getTeacherInfo(): Promise<void> {
  //     try {
  //       setDetailsLoading(true);
  //       const teacherExists = await showTeacher(Number(id));
  //       setTeacher(teacherExists);
  //     } catch {
  //       setTeacher({} as Teacher);
  //       openSnack({
  //         type: 'error',
  //         title: 'Erro ao buscar matérias',
  //         open: true,
  //       });
  //     } finally {
  //       setDetailsLoading(false);
  //     }
  //   }
  //   if (id) {
  //     getTeacherInfo();
  //   }
  // }, [id, showTeacher, openSnack]);

  // const handleCreateTeacher = useCallback(
  //   async ({ name, email, enrollment }: CreateTeacherRequest) => {
  //     setLoading(true);
  //     try {
  //       await updateTeacher(Number(id), {
  //         name, email, enrollment
  //       });
  //       openSnack({
  //         type: 'success',
  //         title: 'Sucesso ao alterar professor',
  //         open: true,
  //       });
  //     } catch (err) {
  //       openSnack({
  //         type: 'error',
  //         title: 'Erro ao alterar professor',
  //         open: true,
  //       });
  //     } finally {
  //       setTeacher({} as Teacher);
  //       setLoading(false);
  //     }
  //   },
  //   [updateTeacher, openSnack, id],
  // );

  return (
    <Container>
      {detailsLoading ? (
        <GlobalLoading open={detailsLoading} />
      ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {/* <TeacherForm
                title="Alterar professor"
                actionTitle="Alterar"
                defaultTeacher={teacher}
                handleForm={() => {
                  console.log("oi");
                }}
                handleFormLoading={loading}
              /> */}
            </Grid>
          </Grid>
        )}
    </Container>
  );
};

export default UpdateTeacher;
