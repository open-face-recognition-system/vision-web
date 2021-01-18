import React, { useCallback, useEffect, useState } from 'react';

import MaterialTable from 'material-table';

import { useHistory } from 'react-router-dom';
import { Student, useStudent } from '../../../hooks/student';
import { useSnack } from '../../../hooks/snackbar';
import ConfirmDialog from '../../../components/ConfirmDialog';

const List: React.FC = () => {
  const history = useHistory();
  const { openSnack } = useSnack();
  const { listStudents, deleteStudent } = useStudent();

  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [students, setStudents] = React.useState<Student[]>([]);

  useEffect(() => {
    async function getAllSubjects(): Promise<void> {
      setLoading(true);
      const subjectsResponse = await listStudents({
        page: page + 1,
        limit,
      });
      setStudents(subjectsResponse.data);
      setTotal(subjectsResponse.total);
      setLoading(false);
    }

    getAllSubjects();
  }, [listStudents, limit, page]);

  const handleDeleteStudent = useCallback(async () => {
    if (currentId) {
      try {
        await deleteStudent(currentId);
        openSnack({
          type: 'success',
          title: 'Sucesso ao deletar aluno',
          open: true,
        });
        setStudents(students.filter(student => student.user.id !== currentId));
      } catch {
        openSnack({
          type: 'error',
          title: 'Erro ao deletar aluno',
          open: true,
        });
      }
    }
    setOpenDialog(false);
  }, [currentId, deleteStudent, openSnack, setStudents, students]);

  return (
    <div style={{ minWidth: '100%' }}>
      <ConfirmDialog
        open={openDialog}
        title="Deletar aluno"
        description="Deseja realmente deletar o aluno?"
        handleCancel={() => {
          setOpenDialog(false);
        }}
        handleConfirm={handleDeleteStudent}
      />
      <MaterialTable
        isLoading={loading}
        columns={[
          { title: 'Nome', field: 'user.name' },
          { title: 'E-mail', field: 'user.email' },
          { title: 'Matrícula', field: 'enrollment' },
        ]}
        data={students}
        totalCount={total}
        page={page}
        actions={[
          {
            icon: 'add',
            tooltip: 'Adicionar Aluno',
            isFreeAction: true,
            onClick: () => history.push(`/students/create`),
          },
          {
            icon: 'edit',
            tooltip: 'Editar Aluno',
            onClick: (event, rowData) => {
              const student = rowData as Student;
              history.push(`/students/${student.id}/update`);
            },
          },
          () => ({
            icon: 'delete',
            tooltip: 'Deletar Aluno',
            onClick: (event, rowData) => {
              const student = rowData as Student;
              setCurrentId(student.user.id);
              setOpenDialog(true);
            },
          }),
        ]}
        onRowClick={(event, rowData) => {
          const classItem = rowData as Student;
          history.push(`/students/${classItem.id}/details`);
        }}
        onChangePage={newPage => {
          setPage(newPage);
        }}
        onChangeRowsPerPage={newLimit => {
          setLimit(newLimit);
          setPage(0);
        }}
        options={{
          actionsColumnIndex: -1,
          pageSize: 10,
        }}
        title="Alunos"
      />
    </div>
  );
};

export default List;
