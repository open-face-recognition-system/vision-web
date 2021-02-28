import React, { useEffect, useState, useCallback } from 'react';
import { Grid, MenuItem, TextField } from '@material-ui/core';

import { PaperContainer, ListContainer } from './styles';

import Title from '../../../../components/Title';
import Button from '../../../../components/Button';
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

  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState<number | string>('');
  const [currentEnrolledStudents, setCurrentEnrolledStudents] = useState<
    StudentSubject[]
  >(enrolledStudents || []);

  useEffect(() => {
    async function getAllStudents(): Promise<void> {
      const studentsResponse = await listStudents({
        page: 1,
        limit: 100,
      });
      setStudents(studentsResponse.data);
    }

    getAllStudents();
  }, [listStudents]);

  const handleAddStudent = useCallback(async () => {
    try {
      const enrolledStudent = await enrollStudent(subjectId, studentId);
      openSnack({
        type: 'success',
        title: 'Sucesso ao matricular aluno',
        open: true,
      });

      setCurrentEnrolledStudents([
        ...currentEnrolledStudents,
        {
          isEnrolled: true,
          attendanceId: 0,
          isPresent: false,
          student: enrolledStudent,
        },
      ]);
    } catch (err) {
      openSnack({
        type: 'error',
        title: 'Erro ao matricular aluno',
        open: true,
      });
    } finally {
      setStudentId('');
    }
  }, [
    subjectId,
    studentId,
    enrollStudent,
    openSnack,
    setCurrentEnrolledStudents,
    currentEnrolledStudents,
  ]);

  const handleRemoveStudent = useCallback(
    async (idToRemove: number) => {
      try {
        await unenrollStudent(subjectId, idToRemove);
        openSnack({
          type: 'success',
          title: 'Sucesso ao dematricular aluno',
          open: true,
        });
        setCurrentEnrolledStudents(
          currentEnrolledStudents.filter(
            currentEnrolledStudent =>
              currentEnrolledStudent.student.id !== idToRemove,
          ),
        );
      } catch (err) {
        openSnack({
          type: 'error',
          title: 'Erro ao dematricular aluno',
          open: true,
        });
      } finally {
        setStudentId('');
      }
    },
    [
      unenrollStudent,
      subjectId,
      openSnack,
      setCurrentEnrolledStudents,
      currentEnrolledStudents,
    ],
  );

  return (
    <PaperContainer>
      <Title title="Alunos matriculados" />
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
      >
        <Grid item xs={12} sm={10}>
          <TextField
            variant="outlined"
            name="student"
            label="Aluno"
            fullWidth
            value={studentId}
            select
            onChange={event => {
              setStudentId(Number(event.target.value));
            }}
          >
            {students.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.user.name}
              </MenuItem>
            ))}
          </TextField>
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
