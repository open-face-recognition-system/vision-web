import React, { useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';
import MaterialTable from 'material-table';

import { useHistory } from 'react-router-dom';
import { Semester, useSemester } from '../../../hooks/semester';

const List: React.FC = () => {
  const history = useHistory();

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
