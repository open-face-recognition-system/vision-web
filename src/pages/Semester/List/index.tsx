import React, { useEffect, useState } from 'react';

import MaterialTable from 'material-table';

import { Semester, useSemester } from '../../../hooks/semester';

const List: React.FC = () => {
  const { listSemesters } = useSemester();

  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
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

  return (
    <div style={{ minWidth: '100%' }}>
      <MaterialTable
        isLoading={loading}
        columns={[
          { title: 'Início', field: 'startDate', type: 'date' },
          { title: 'Fim', field: 'endDate' },
        ]}
        data={semesters}
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
        title="Semestres"
      />
    </div>
  );
};

export default List;
