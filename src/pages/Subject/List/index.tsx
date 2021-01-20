/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useCallback, useEffect, useState } from 'react';
import Chip from '@material-ui/core/Chip';
import MaterialTable from 'material-table';

import { useHistory } from 'react-router-dom';
import { Subject, useSubject } from '../../../hooks/subject';
import { useSnack } from '../../../hooks/snackbar';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useAuth } from '../../../hooks/auth';

const List: React.FC = () => {
  const history = useHistory();
  const { openSnack } = useSnack();
  const { user } = useAuth();
  const { listSubjects, listTeacherSubjects, deleteSubject } = useSubject();

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    async function getAllSubjects(): Promise<void> {
      setLoading(true);
      let subjectsResponse;
      if (user.role === "admin") {
        subjectsResponse = await listSubjects({
          page: page + 1,
          limit,
        });
      } else {
        subjectsResponse = await listTeacherSubjects({
          page: page + 1,
          limit,
        });
      }
      setSubjects(subjectsResponse.data);
      setTotal(subjectsResponse.total);
      setLoading(false);
    }

    getAllSubjects();
  }, [listSubjects, listTeacherSubjects, user, limit, page]);

  const handleDeleteSubject = useCallback(async () => {
    if (currentId) {
      try {
        await deleteSubject(currentId);
        openSnack({
          type: 'success',
          title: 'Sucesso ao deletar matéria',
          open: true,
        });
        setSubjects(subjects.filter(subject => subject.id !== currentId));
      } catch {
        openSnack({
          type: 'error',
          title: 'Erro ao deletar matéria',
          open: true,
        });
      }
    }
    setOpenDialog(false);
  }, [currentId, deleteSubject, openSnack, setSubjects, subjects]);

  return (
    <div style={{ minWidth: '100%' }}>
      <ConfirmDialog
        open={openDialog}
        title="Deletar matéria"
        description="Deseja realmente deletar o matéria?"
        handleCancel={() => {
          setOpenDialog(false);
        }}
        handleConfirm={handleDeleteSubject}
      />
      <MaterialTable
        isLoading={loading}
        columns={[
          { title: 'Nome', field: 'name' },
          { title: 'Curso', field: 'course' },
          { title: 'Professor', field: 'teacher.user.name' },
          {
            title: 'Treinamento',
            field: 'recognitionFile',
            render: subject => subject.recognitionFile ? (
              <Chip
                color="primary"
                style={{ backgroundColor: 'green' }}
                label="Treinada"
              />
            ) : (
                <Chip
                  color="primary"
                  style={{ backgroundColor: 'red' }}
                  label="Não treinada"
                />
              )
          }
        ]}
        data={subjects}
        totalCount={total}
        page={page}
        actions={[
          {
            icon: 'add',
            tooltip: 'Adicionar Semestre',
            isFreeAction: true,
            onClick: () => history.push(`/subjects/create`),
          },
          {
            icon: 'edit',
            tooltip: 'Editar Semestre',
            onClick: (event, rowData) => {
              const subject = rowData as Subject;
              history.push(`/subjects/${subject.id}/update`);
            },
          },
          () => ({
            icon: 'delete',
            tooltip: 'Deletar Semestre',
            onClick: (event, rowData) => {
              const subject = rowData as Subject;
              setCurrentId(subject.id);
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
        title="Matérias"
      />
    </div>
  );
};

export default List;
