/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import MaterialTable from 'material-table';
import Chip from '@material-ui/core/Chip';
import { useSnack } from '../../../hooks/snackbar';
import { Attendance, useClassItem } from '../../../hooks/class';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { Student } from '../../../hooks/student';

interface ClassParams {
  id?: string | undefined;
}

const List: React.FC = () => {
  const { id } = useParams<ClassParams>();

  const { openSnack } = useSnack();
  const { showAttendance, updateAttendanceClass } = useClassItem();

  const [loading, setLoading] = React.useState(true);
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [
    currentStudent,
    setCurrentStudentSubject,
  ] = useState<Student | null>(null);
  const [
    currentAttendance,
    setCurrentAttendance,
  ] = useState<Attendance | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    async function getClassInfo(): Promise<void> {
      try {
        setLoading(true);
        const attendanceResponse = await showAttendance(Number(id));
        setAttendanceList(attendanceResponse);
      } catch {
        setAttendanceList([]);
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
  }, [id, showAttendance, openSnack]);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const attendanceResponse = await showAttendance(Number(id));
      setAttendanceList(attendanceResponse);
    } catch {
      setAttendanceList([]);
      openSnack({
        type: 'error',
        title: 'Erro ao buscar aula',
        open: true,
      });
    } finally {
      setLoading(false);
    }
  }, [id, showAttendance, openSnack])

  const handleUpdateAttendance = useCallback(async () => {
    if (currentAttendance) {
      try {
        const studentId = Number(currentStudent?.id)
        const attendanceResponse = await updateAttendanceClass(currentAttendance.id, {
          classId: Number(id),
          studentId,
          isPresent: !currentAttendance?.isPresent,
        });
        openSnack({
          type: 'success',
          title: 'Sucesso ao deletar aula',
          open: true,
        });
        setAttendanceList(
          attendanceList.map(attendance => {
            const auxAttendance = attendance
            if (attendance.id === attendanceResponse.id) {
              auxAttendance.isPresent = attendanceResponse.isPresent
            }
            return auxAttendance
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
    currentAttendance,
    attendanceList,
    currentStudent,
    updateAttendanceClass,
    openSnack
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
            icon: 'refresh',
            tooltip: 'Atualizar',
            isFreeAction: true,
            onClick: () => refreshData(),
          },
          {
            icon: 'edit',
            tooltip: 'Editar presença',
            onClick: (event, rowData) => {
              const attendance = rowData as Attendance;
              setCurrentAttendance(attendance);
              setCurrentStudentSubject(attendance.student)
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
        data={attendanceList}
        title="Lista de presença"
      />
    </div>
  );
};

export default List;
