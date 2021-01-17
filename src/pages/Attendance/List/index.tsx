/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import MaterialTable from 'material-table';
import Chip from '@material-ui/core/Chip';
import { useSnack } from '../../../hooks/snackbar';
import { ClassItem, useClassItem } from '../../../hooks/class';
import { StudentSubject } from '../../../hooks/subject';
import ConfirmDialog from '../../../components/ConfirmDialog';

interface ClassParams {
  id?: string | undefined;
}

const List: React.FC = () => {
  const { id } = useParams<ClassParams>();

  const { openSnack } = useSnack();
  const { showClass, updateAttendanceClass } = useClassItem();

  const [loading, setLoading] = React.useState(true);
  const [classItem, setClassItem] = useState<ClassItem>({} as ClassItem);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [
    currentStudentSubject,
    setCurrentStudentSubject,
  ] = useState<StudentSubject | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [students, setStudents] = React.useState<StudentSubject[]>([]);

  useEffect(() => {
    async function getClassInfo(): Promise<void> {
      try {
        setLoading(true);
        const classExists = await showClass(Number(id));
        setStudents(
          classExists.subject.students.map(student => {
            const studentPresent = classExists.attendances.find(
              attendance =>
                attendance.student.id === student.student.id
            );
            const newStudent = student;
            if (studentPresent?.isPresent) {
              newStudent.isPresent = true;
            } else {
              newStudent.isPresent = false;
            }
            newStudent.attendanceId = Number(studentPresent?.id)
            return newStudent;
          }),
        );
        setClassItem(classExists);
      } catch {
        setClassItem({} as ClassItem);
        openSnack({
          type: 'error',
          title: 'Erro ao buscar aula',
          open: true,
        });
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      getClassInfo();
    }
  }, [id, showClass, openSnack]);

  const handleUpdateAttendance = useCallback(async () => {
    if (currentId) {
      try {
        const studentId = Number(currentStudentSubject?.student.id)
        await updateAttendanceClass(currentId, {
          classId: Number(id),
          studentId,
          isPresent: !currentStudentSubject?.isPresent,
        });
        openSnack({
          type: 'success',
          title: 'Sucesso ao deletar aula',
          open: true,
        });
        setStudents(
          students.map(currentStudent => {
            const newStudent = currentStudent;
            if (currentStudent.student.id === studentId) {
              newStudent.isPresent = !currentStudentSubject?.isPresent;
            }
            return newStudent;
          }),
        );
      } catch {
        openSnack({
          type: 'error',
          title: 'Erro ao deletar aula',
          open: true,
        });
      }
    }
    setOpenDialog(false);
  }, [
    id,
    currentId,
    updateAttendanceClass,
    openSnack,
    setStudents,
    students,
    currentStudentSubject,
  ]);

  return (
    <div style={{ minWidth: '100%' }}>
      <ConfirmDialog
        open={openDialog}
        title="Alterar presença?"
        description="Deseja realmente alterar manualmente a presença do aluno?"
        handleCancel={() => {
          setOpenDialog(false);
        }}
        handleConfirm={handleUpdateAttendance}
      />
      <MaterialTable
        isLoading={loading}
        options={{
          search: false,
          paging: false,
          exportButton: true,
          actionsColumnIndex: -1,
        }}
        localization={{
          toolbar: {
            exportCSVName: 'CSV',
            exportPDFName: 'PDF',
            exportTitle: 'Exportar',
          },
        }}
        actions={[
          {
            icon: 'edit',
            tooltip: 'Editar presença',
            onClick: (event, rowData) => {
              const subjectStudentc = rowData as StudentSubject;
              setCurrentId(subjectStudentc.attendanceId);
              setCurrentStudentSubject(subjectStudentc)
              setOpenDialog(true);
            },
          },
        ]}
        columns={[
          {
            title: 'Aluno',
            field: 'student.user.name',
          },
          {
            title: 'Presença na aula',
            field: 'isPresent',
            render: student =>
              student.isPresent ? (
                <Chip
                  color="primary"
                  style={{ backgroundColor: 'green' }}
                  label="Presente"
                />
              ) : (
                  <Chip
                    color="primary"
                    style={{ backgroundColor: 'red' }}
                    label="Não presente"
                  />
                ),
          },
        ]}
        data={students}
        title={`Lista de presença - ${classItem.subject?.name}`}
      />
    </div>
  );
};

export default List;
