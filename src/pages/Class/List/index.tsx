import React, { useEffect, useState, useCallback } from 'react';
import { parseISO, format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import MaterialTable from 'material-table';
import { useSnack } from '../../../hooks/snackbar';
import { ClassItem, useClassItem } from '../../../hooks/class';
import ConfirmDialog from '../../../components/ConfirmDialog';

const List: React.FC = () => {
  const history = useHistory();
  const { openSnack } = useSnack();
  const { listClasses, deleteClass } = useClassItem();

  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [classes, setClasses] = React.useState<ClassItem[]>([]);

  useEffect(() => {
    async function getAllSubjects(): Promise<void> {
      setLoading(true);
      const subjectsResponse = await listClasses({
        page: page + 1,
        limit,
      });
      setClasses(subjectsResponse.data);
      setTotal(subjectsResponse.total);
      setLoading(false);
    }

    getAllSubjects();
  }, [listClasses, limit, page]);

  const handleDeleteClass = useCallback(async () => {
    if (currentId) {
      try {
        await deleteClass(currentId);
        openSnack({
          type: 'success',
          title: 'Sucesso ao deletar aula',
          open: true,
        });
        setClasses(classes.filter(classItem => classItem.id !== currentId));
      } catch {
        openSnack({
          type: 'error',
          title: 'Erro ao criar aula',
          open: true,
        });
      }
    }
    setOpenDialog(false);
  }, [currentId, deleteClass, openSnack, setClasses, classes]);

  return (
    <div style={{ minWidth: '100%' }}>
      <ConfirmDialog
        open={openDialog}
        title="Deletar aula"
        description="Deseja realmente deletar o aula?"
        handleCancel={() => {
          setOpenDialog(false);
        }}
        handleConfirm={handleDeleteClass}
      />
      <MaterialTable
        isLoading={loading}
        columns={[
          {
            title: 'Data',
            field: 'date',
            render: classItem => {
              const firstDate = parseISO(String(classItem.date));
              const formattedDate = format(firstDate, 'dd/MM/yyyy');
              return <>{formattedDate}</>;
            },
          },
          {
            title: 'Matéria',
            field: 'subject.name',
          },
        ]}
        data={classes}
        totalCount={total}
        page={page}
        actions={[
          {
            icon: 'add',
            tooltip: 'Adicionar Aula',
            isFreeAction: true,
            onClick: () => history.push(`/classes/create`),
          },
          {
            icon: 'edit',
            tooltip: 'Editar Aula',
            onClick: (event, rowData) => {
              const classItem = rowData as ClassItem;
              history.push(`/classes/${classItem.id}/update`);
            },
          },
          () => ({
            icon: 'delete',
            tooltip: 'Deletar Aula',
            onClick: (event, rowData) => {
              const classItem = rowData as ClassItem;
              setCurrentId(classItem.id);
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
        }}
        title="Aulas"
      />
    </div>
  );
};

export default List;
