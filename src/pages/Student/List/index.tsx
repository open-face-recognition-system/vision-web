import React, { useEffect, useState } from 'react';

import MaterialTable from 'material-table';

import { Student, useStudent } from '../../../hooks/student';

const List: React.FC = () => {
  const { listStudents } = useStudent();

  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
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

  return (
    <div style={{ minWidth: '100%' }}>
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
        onRowClick={() => {
          alert(`You saved`);
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
        }}
        title="Alunos"
      />
    </div>
  );
};

export default List;
