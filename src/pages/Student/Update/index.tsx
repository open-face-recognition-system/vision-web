/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useCallback, useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';

import { useParams } from 'react-router-dom';

import { Student, useStudent } from '../../../hooks/student';
import { useSnack } from '../../../hooks/snackbar';

import CreateStudentRequest from '../../../dtos/CreateStudentRequest';

import StudentForm from '../components/StudentForm';
import Container from '../../../components/Container';
import GlobalLoading from '../../../components/GlobalLoading';

interface StudentParams {
  id?: string | undefined;
}

const UpdateStudent: React.FC = () => {
  const { id } = useParams<StudentParams>();

  const { openSnack } = useSnack();
  const { updateStudent, showStudent } = useStudent();

  const [student, setStudent] = useState<Student>({} as Student);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleUpdateStudent = useCallback(
    async ({ name, email }: CreateStudentRequest) => {
      setLoading(true);
      try {
        await updateStudent(Number(id), {
          name,
          email,
        });
        openSnack({
          type: 'success',
          title: 'Sucesso ao alterar aluno',
          open: true,
        });
      } catch (err) {
        openSnack({
          type: 'error',
          title: 'Erro ao alterar aluno',
          open: true,
        });
      } finally {
        setStudent({} as Student);
        setLoading(false);
      }
    },
    [updateStudent, openSnack, id],
  );

  return (
    <Container>
      {detailsLoading ? (
        <GlobalLoading open={detailsLoading} />
      ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StudentForm
                title="Alterar aluno"
                actionTitle="Alterar"
                isUpdate
                defaultStudent={student}
                handleForm={handleUpdateStudent}
                handleFormLoading={loading}
              />
            </Grid>
          </Grid>
        )}
    </Container>
  );
};

export default UpdateStudent;
