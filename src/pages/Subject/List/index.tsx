/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useEffect, useState } from 'react';
import Chip from '@material-ui/core/Chip';
import MaterialTable from 'material-table';

import { useHistory } from 'react-router-dom';
import { Subject, useSubject } from '../../../hooks/subject';

const List: React.FC = () => {
  const history = useHistory();

  const { listSubjects } = useSubject();
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);

  useEffect(() => {
    async function getAllSubjects(): Promise<void> {
      setLoading(true);
      const subjectsResponse = await listSubjects({
        page: page + 1,
        limit,
      });
      setSubjects(subjectsResponse.data);
      setTotal(subjectsResponse.total);
      setLoading(false);
    }

    getAllSubjects();
  }, [listSubjects, limit, page]);

  return (
    <div style={{ minWidth: '100%' }}>
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
            onClick: () => alert(`You saved`),
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
        title="Matérias"
      />
    </div>
  );
};

export default List;
