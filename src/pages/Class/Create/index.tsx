import React, { useCallback, useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';

import { useClassItem } from '../../../hooks/class';
import { useSnack } from '../../../hooks/snackbar';

import CreateClassRequest from '../../../dtos/CreateClassRequest';

import ClassForm from '../components/ClassForm';
import Container from '../../../components/Container';
import { Semester, useSemester } from '../../../hooks/semester';
import { Subject, useSubject } from '../../../hooks/subject';

const CreateClass: React.FC = () => {
  const { openSnack } = useSnack();
  const { createClass } = useClassItem();

  const { listSemesters } = useSemester();
  const { listSubjects } = useSubject();

  const [loading, setLoading] = useState(false);
  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);

  useEffect(() => {
    async function getAllSemestersAndSubjects(): Promise<void> {
      listSemesters({
        page: 1,
        limit: 50,
      }).then(response => {
        setSemesters(response.data);
      });
      listSubjects({
        page: 1,
        limit: 50,
      }).then(response => {
        setSubjects(response.data);
      });
    }

    getAllSemestersAndSubjects();
  }, [listSemesters, listSubjects]);

  const handleCreateClass = useCallback(
    async ({
      startHour,
      endHour,
      date,
      subjectId,
      semesterId,
    }: CreateClassRequest) => {
      setLoading(true);
      try {
        if (startHour && endHour && date) {
          startHour.setDate(date.getDate());
          endHour.setDate(date.getDate());
        }
        await createClass({
          startHour,
          endHour,
          date,
          subjectId,
          semesterId,
        });
        openSnack({
          type: 'success',
          title: 'Sucesso ao criar aula',
          open: true,
        });
      } catch (err) {
        openSnack({
          type: 'error',
          title: 'Erro ao criar aula',
          open: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [createClass, openSnack],
  );

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ClassForm
            title="Criar semestre"
            actionTitle="Criar"
            clearAllFields
            subjects={subjects}
            semesters={semesters}
            defaultClass={null}
            handleForm={handleCreateClass}
            handleFormLoading={loading}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateClass;
