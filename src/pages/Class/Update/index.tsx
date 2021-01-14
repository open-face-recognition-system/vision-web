/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useCallback, useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';

import { useParams } from 'react-router-dom';

import { ClassItem, useClassItem } from '../../../hooks/class';
import { useSnack } from '../../../hooks/snackbar';

import CreateClassRequest from '../../../dtos/CreateClassRequest';

import ClassForm from '../components/ClassForm';
import Container from '../../../components/Container';
import GlobalLoading from '../../../components/GlobalLoading';
import { Semester, useSemester } from '../../../hooks/semester';
import { Subject, useSubject } from '../../../hooks/subject';

interface ClassParams {
  id?: string | undefined;
}

const UpdateClass: React.FC = () => {
  const { id } = useParams<ClassParams>();

  const { openSnack } = useSnack();
  const { updateClass, showClass } = useClassItem();
  const { listSemesters } = useSemester();
  const { listSubjects } = useSubject();

  const [classItem, setClassItem] = useState<ClassItem>({} as ClassItem);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    async function getClassInfo(): Promise<void> {
      try {
        setDetailsLoading(true);
        const classExists = await showClass(Number(id));
        const semestersList = await listSemesters({
          page: 1,
          limit: 50,
        })
        setSemesters(semestersList.data);
        const subjectsList = await listSubjects({
          page: 1,
          limit: 50,
        })
        setSubjects(subjectsList.data);
        setClassItem(classExists);
      } catch {
        setClassItem({} as ClassItem);
        openSnack({
          type: 'error',
          title: 'Erro ao buscar aula',
          open: true,
        });
      } finally {
        setDetailsLoading(false);
      }
    }
    if (id) {
      getClassInfo();
    }
  }, [id, showClass, openSnack, listSemesters, listSubjects]);


  const handleCreateClass = useCallback(
    async ({ startHour,
      endHour,
      date,
      subjectId,
      semesterId, }: CreateClassRequest) => {
      setLoading(true);
      try {
        await updateClass(Number(id), {
          startHour,
          endHour,
          date,
          subjectId,
          semesterId,
        });
        openSnack({
          type: 'success',
          title: 'Sucesso ao alterar aula',
          open: true,
        });
      } catch (err) {
        openSnack({
          type: 'error',
          title: 'Erro ao alterar aula',
          open: true,
        });
      } finally {
        setClassItem({} as ClassItem);
        setLoading(false);
      }
    },
    [updateClass, openSnack, id],
  );

  return (
    <Container>
      {detailsLoading ? (
        <GlobalLoading open={detailsLoading} />
      ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ClassForm
                title="Alterar semestre"
                actionTitle="Alterar"
                semesters={semesters}
                subjects={subjects}
                defaultClass={classItem}
                handleForm={handleCreateClass}
                handleFormLoading={loading}
              />
            </Grid>
          </Grid>
        )}
    </Container>
  );
};

export default UpdateClass;
