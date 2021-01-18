import React, { useCallback, useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';
import MaterialTable from 'material-table';

import { useHistory } from 'react-router-dom';
import { Semester, useSemester } from '../../../hooks/semester';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useSnack } from '../../../hooks/snackbar';

const List: React.FC = () => {
  const history = useHistory();
  const { openSnack } = useSnack();

  const { listSemesters, deleteSemester } = useSemester();

  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [semesters, setSemesters] = React.useState<Semester[]>([]);

  useEffect(() => {
    async function getAllSubjects(): Promise<void> {
      setLoading(true);
      const subjectsResponse = await listSemesters({
        page: page + 1,
        limit,
      });
      setSemesters(subjectsResponse.data);
      setTotal(subjectsResponse.total);
      setLoading(false);
    }

    getAllSubjects();
  }, [listSemesters, limit, page]);

  const handleDeleteSemester = useCallback(async () => {
    if (currentId) {
      try {
        await deleteSemester(currentId);
        openSnack({
          type: 'success',
          title: 'Sucesso ao deletar semestre',
          open: true,
        });
        setSemesters(semesters.filter(semester => semester.id !== currentId));
      } catch {
        openSnack({
          type: 'error',
          title: 'Erro ao criar semestre',
          open: true,
        });
      }
    }
    setOpenDialog(false);
  }, [currentId, deleteSemester, openSnack, semesters]);

  return (
    <div style={{ minWidth: '100%' }}>
      <ConfirmDialog
        open={openDialog}
        title="Deletar semestre"
        description="Deseja realmente deletar o semestre?"
        handleCancel={() => {
          setOpenDialog(false);
        }}
        handleConfirm={handleDeleteSemester}
      />
      <MaterialTable
        isLoading={loading}
        columns={[
          {
            title: 'Início',
            field: 'startDate',
            render: semester => {
              const firstDate = parseISO(String(semester.startDate));
              const formattedDate = format(firstDate, 'dd/MM/yyyy');
              return <p>{formattedDate}</p>;
            },
          },
          {
            title: 'Fim',
            field: 'endDate',
            render: semester => {
              const endDate = parseISO(String(semester.endDate));
              const formattedDate = format(endDate, 'dd/MM/yyyy');
              return <p>{formattedDate}</p>;
            },
          },
        ]}
        data={semesters}
        totalCount={total}
        page={page}
        actions={[
          {
            icon: 'add',
            tooltip: 'Adicionar Semestre',
            isFreeAction: true,
            onClick: () => history.push(`/semesters/create`),
          },
          {
            icon: 'edit',
            tooltip: 'Editar Semestre',
            onClick: (event, rowData) => {
              const semester = rowData as Semester;
              history.push(`/semesters/${semester.id}/update`);
            },
          },
          () => ({
            icon: 'delete',
            tooltip: 'Deletar Semestre',
            onClick: (event, rowData) => {
              const semester = rowData as Semester;
              setCurrentId(semester.id);
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
          search: false,
          pageSize: 10,
        }}
        title="Semestres"
      />
    </div>
  );
};

export default List;
