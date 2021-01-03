/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useCallback, useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';

import { useParams } from 'react-router-dom';

import { Subject, useSubject } from '../../../hooks/subject';
import { useSnack } from '../../../hooks/snackbar';

import CreateSubjectRequest from '../../../dtos/CreateSubjectRequest';

import SubjectForm from '../components/SubjectForm';
import EnrolledStudents from '../components/EnrolledStudents';
import Container from '../../../components/Container';
import GlobalLoading from '../../../components/GlobalLoading';

interface SubjectParams {
  id?: string | undefined;
}

const UpdateSubject: React.FC = () => {
  const { id } = useParams<SubjectParams>();

  const { openSnack } = useSnack();
  const { updateSubject, showSubject } = useSubject();

  const [subject, setSubject] = useState<Subject>({} as Subject);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getSubjectInfo(): Promise<void> {
      try {
        setDetailsLoading(true);
        const subjectExists = await showSubject(Number(id));
        setSubject(subjectExists);
      } catch {
        setSubject({} as Subject);
        openSnack({
          type: 'error',
          title: 'Erro ao buscar matérias',
          open: true,
        });
      } finally {
        setDetailsLoading(false);
      }
    }
    if (id) {
      getSubjectInfo();
    }
  }, [id, showSubject, openSnack]);

  const handleCreateSubject = useCallback(
    async ({ name, course, description, teacherId }: CreateSubjectRequest) => {
      setLoading(true);
      try {
        await updateSubject(Number(id), {
          name,
          course,
          description,
          teacherId,
        });
        openSnack({
          type: 'success',
          title: 'Sucesso ao alterar matéria',
          open: true,
        });
      } catch (err) {
        openSnack({
          type: 'error',
          title: 'Erro ao alterar matéria',
          open: true,
        });
      } finally {
        setSubject({} as Subject);
        setLoading(false);
      }
    },
    [updateSubject, openSnack, id],
  );

  return (
    <Container>
      {detailsLoading ? (
        <GlobalLoading open={detailsLoading} />
      ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <SubjectForm
                title="Alterar matéria"
                actionTitle="Alterar"
                defaultSubject={subject}
                handleForm={handleCreateSubject}
                handleFormLoading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <EnrolledStudents />
            </Grid>
          </Grid>
        )}
    </Container>
  );
};

export default UpdateSubject;
