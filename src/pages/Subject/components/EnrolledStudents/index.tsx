import React, { useEffect, useState, useCallback } from 'react';
import { Grid } from '@material-ui/core';

import { PaperContainer, ListContainer } from './styles';

import Title from '../../../../components/Title';
import Button from '../../../../components/Button';
import AutocompleteTextField from '../../../../components/AutocompleteTextField';
import { Student, useStudent } from '../../../../hooks/student';
import { StudentSubject, useSubject } from '../../../../hooks/subject';
import { useSnack } from '../../../../hooks/snackbar';

import EnrolledStudentItem from '../EnrolledStudentItem';

interface EnrolledStudentsProps {
  enrolledStudents: StudentSubject[];
  subjectId: number;
}

const EnrolledStudents: React.FC<EnrolledStudentsProps> = ({
  enrolledStudents,
  subjectId,
}: EnrolledStudentsProps) => {
  const { listStudents } = useStudent();
  const { openSnack } = useSnack();
  const { enrollStudent, unenrollStudent } = useSubject();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student>({} as Student);
  const [currentEnrolledStudents, setCurrentEnrolledStudents] = useState<
    StudentSubject[]
  >(enrolledStudents || []);

  useEffect(() => {
    if (!open) {
      setStudents([]);
    }
  }, [open]);

  const handleAddStudent = useCallback(async () => {
    try {
      const enrolledStudent = await enrollStudent(subjectId, student.id);
      openSnack({
        type: 'success',
        title: 'Sucesso ao matricular aluno',
        open: true,
      });
      setCurrentEnrolledStudents([
        ...currentEnrolledStudents,
        {
          isEnrolled: true,
          student: enrolledStudent,
        },
      ]);
    } catch (err) {
      openSnack({
        type: 'error',
        title: 'Erro ao matricular aluno',
        open: true,
      });
    }
  }, [
    subjectId,
    student.id,
    enrollStudent,
    openSnack,
    setCurrentEnrolledStudents,
    currentEnrolledStudents,
  ]);

  const handleRemoveStudent = useCallback(
    async (studentId: number) => {
      try {
        await unenrollStudent(subjectId, studentId);
        openSnack({
          type: 'success',
          title: 'Sucesso ao dematricular aluno',
          open: true,
        });
        setCurrentEnrolledStudents(
          currentEnrolledStudents.filter(
            currentEnrolledStudent =>
              currentEnrolledStudent.student.id !== studentId,
          ),
        );
      } catch (err) {
        openSnack({
          type: 'error',
          title: 'Erro ao dematricular aluno',
          open: true,
        });
      }
    },
    [
      subjectId,
      unenrollStudent,
      openSnack,
      setCurrentEnrolledStudents,
      currentEnrolledStudents,
    ],
  );

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
            limit: 100,
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
        <Button text="+" color="primary" onClick={handleAddStudent} />
      </Grid>
      <Grid item xs={12}>
        <ListContainer>
          {currentEnrolledStudents.map(
            currentStudent =>
              currentStudent.isEnrolled && (
                <EnrolledStudentItem
                  student={currentStudent.student}
                  handleRemoveStudent={handleRemoveStudent}
                />
              ),
          )}
        </ListContainer>
      </Grid>
    </PaperContainer>
  );
};

export default EnrolledStudents;
