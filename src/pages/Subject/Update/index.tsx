/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';

import { Grid } from '@material-ui/core';

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
  const { updateSubject, showSubject, training, enrollByPdfStudent } = useSubject();

  const [subject, setSubject] = useState<Subject>({} as Subject);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trainingLoading, setTrainingLoading] = useState(false);

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

  const handleTraining = useCallback(
    async () => {
      setTrainingLoading(true);
      try {
        await training(Number(id));
        openSnack({
          type: 'success',
          title: 'Treinamento realizado com sucesso',
          open: true,
        });
      } catch (err) {
        openSnack({
          type: 'error',
          title: 'Erro ao realizar treinamento',
          open: true,
        });
      } finally {
        setTrainingLoading(false);
      }
    },
    [training, openSnack, id],
  );

  const handleUploadPdf = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();
        data.append('file', e.target.files[0]);
        try {
          await enrollByPdfStudent(Number(id), data)
          openSnack({
            type: 'success',
            title: 'Sucesso ao matricular alunos',
            open: true,
          });
        } catch {
          openSnack({
            type: 'error',
            title: 'Erro ao matricular alunos',
            open: true,
          });
        }
      }
    },
    [id, enrollByPdfStudent, openSnack],
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
                isUpdate
                defaultSubject={subject}
                handleUploadPdf={handleUploadPdf}
                handleForm={handleCreateSubject}
                handleTraining={handleTraining}
                handleTrainingLoading={trainingLoading}
                handleFormLoading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <EnrolledStudents
                subjectId={subject.id}
                enrolledStudents={subject.students}
              />
            </Grid>
          </Grid>
        )}
    </Container>
  );
};

export default UpdateSubject;
