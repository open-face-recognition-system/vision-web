import React, { useEffect, useState } from 'react';

import MaterialTable from 'material-table';
import { useHistory } from 'react-router-dom';
import { Teacher, useTeacher } from '../../../hooks/teacher';

const List: React.FC = () => {
  const history = useHistory();
  const { listTeachers } = useTeacher();

  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
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

  return (
    <div style={{ minWidth: '100%' }}>
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
        title="Professores"
      />
    </div>
  );
};

export default List;
