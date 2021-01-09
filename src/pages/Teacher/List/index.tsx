import React, { useEffect, useState } from 'react';

import MaterialTable from 'material-table';

import { Teacher, useTeacher } from '../../../hooks/teacher';

const List: React.FC = () => {
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
            tooltip: 'Adicionar Semestre',
            isFreeAction: true,
            onClick: () => alert(`You saved`),
          },
          {
            icon: 'edit',
            tooltip: 'Editar Semestre',
            onClick: () => alert(`You saved`),
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
        title="Professores"
      />
    </div>
  );
};

export default List;
