import React, { useEffect, useState } from 'react';

import MaterialTable from 'material-table';

import { useHistory } from 'react-router-dom';
import { Student, useStudent } from '../../../hooks/student';

const List: React.FC = () => {
  const history = useHistory();
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
