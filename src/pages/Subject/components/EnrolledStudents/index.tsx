import React, { useEffect, useState, useCallback } from 'react';
import { Grid } from '@material-ui/core';

import { PaperContainer, ListContainer } from './styles';

import Title from '../../../../components/Title';
import Button from '../../../../components/Button';
import AutocompleteTextField from '../../../../components/AutocompleteTextField';
import { Student, useStudent } from '../../../../hooks/student';

import EnrolledStudentItem from '../EnrolledStudentItem';

const EnrolledStudents: React.FC = () => {
  const { listStudents } = useStudent();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student>({} as Student);

  useEffect(() => {
    if (!open) {
      setStudents([]);
    }
  }, [open]);

  const handleChangeStudent = useCallback(
    async studentName => {
      if (studentName) {
        const query = {
          name: studentName,
        };
        setLoading(true);
        const studentsResponse = await listStudents(
          {
            page: 1,
            per_page: 100,
          },
          query,
        );
        setLoading(false);
        setStudents(studentsResponse.data);
      }
    },
    [listStudents],
  );

  return (
    <PaperContainer>
      <Title title="Alunos matriculados" />
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item xs={12} sm={10}>
          <AutocompleteTextField
            open={open}
            name="student"
            label="Aluno"
            loading={loading}
            defaultEntity={student}
            entities={students}
            setValue={handleChangeStudent}
            setEntity={setStudent}
            setOpen={setOpen}
          />
        </Grid>
        <Button
          text="+"
          color="primary"
          onClick={() => {
            console.log('Clicou');
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <ListContainer>
          <EnrolledStudentItem />
        </ListContainer>
      </Grid>
    </PaperContainer>
  );
};

export default EnrolledStudents;
