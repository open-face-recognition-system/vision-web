import React, { useCallback, useEffect, useState } from 'react';

import MaterialTable from 'material-table';
import { useHistory } from 'react-router-dom';
import { Teacher, useTeacher } from '../../../hooks/teacher';
import { useSnack } from '../../../hooks/snackbar';
import ConfirmDialog from '../../../components/ConfirmDialog';

const List: React.FC = () => {
  const history = useHistory();
  const { openSnack } = useSnack();
  const { listTeachers, deleteTeacher } = useTeacher();

  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);

  useEffect(() => {
    async function getAllSubjects(): Promise<void> {
      setLoading(true);
      const subjectsResponse = await listTeachers({
        page: page + 1,
        limit,
      });
      setTeachers(subjectsResponse.data);
      setTotal(subjectsResponse.total);
      setLoading(false);
    }

    getAllSubjects();
  }, [listTeachers, limit, page]);

  const handleDeleteTeacher = useCallback(async () => {
    if (currentId) {
      try {
        await deleteTeacher(currentId);
        openSnack({
          type: 'success',
          title: 'Sucesso ao deletar professor',
          open: true,
        });
        setTeachers(teachers.filter(teacher => teacher.user.id !== currentId));
      } catch {
        openSnack({
          type: 'error',
          title: 'Erro ao deletar professor',
          open: true,
        });
      }
    }
    setOpenDialog(false);
  }, [currentId, deleteTeacher, openSnack, setTeachers, teachers]);

  return (
    <div style={{ minWidth: '100%' }}>
      <ConfirmDialog
        open={openDialog}
        title="Deletar professor"
        description="Deseja realmente deletar o professor?"
        handleCancel={() => {
          setOpenDialog(false);
        }}
        handleConfirm={handleDeleteTeacher}
      />
      <MaterialTable
        isLoading={loading}
        columns={[
          { title: 'Nome', field: 'user.name' },
          { title: 'E-mail', field: 'user.email' },
          { title: 'Matrícula', field: 'enrollment' },
        ]}
        data={teachers}
        totalCount={total}
        page={page}
        actions={[
          {
            icon: 'add',
            tooltip: 'Adicionar Professor',
            isFreeAction: true,
            onClick: () => history.push(`/teachers/create`),
          },
          {
            icon: 'edit',
            tooltip: 'Editar Professor',
            onClick: (event, rowData) => {
              const teacher = rowData as Teacher;
              history.push(`/teachers/${teacher.id}/update`);
            },
          },
          () => ({
            icon: 'delete',
            tooltip: 'Deletar Professor',
            onClick: (event, rowData) => {
              const teacher = rowData as Teacher;
              setCurrentId(teacher.user.id);
              setOpenDialog(true);
            },
          }),
        ]}
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
        title="Professores"
      />
    </div>
  );
};

export default List;
