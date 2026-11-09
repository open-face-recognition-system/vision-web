import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Delete, Edit } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import DataTable from '../components/DataTable';
import FormCard from '../components/FormCard';
import { Semester, semesters } from '../resources';
import { formatDate, parseDate, toDateOnly } from '../format';
import useLoad from '../useLoad';
import useRecordId from '../useRecordId';

export function SemesterList() {
  const navigate = useNavigate();

  return (
    <DataTable<Semester>
      title="Semestres"
      load={semesters.list}
      onAdd={() => navigate('/semesters/new')}
      columns={[
        { label: 'Início', render: semester => formatDate(semester.startDate) },
        { label: 'Fim', render: semester => formatDate(semester.endDate) },
      ]}
      actions={[
        { label: 'Editar', icon: <Edit />, run: semester => navigate(`/semesters/${semester.id}/edit`) },
        {
          label: 'Excluir',
          icon: <Delete />,
          confirm: 'Deseja realmente excluir este semestre?',
          success: 'Semestre excluído',
          run: semester => semesters.remove(semester.id),
        },
      ]}
    />
  );
}

export function SemesterForm() {
  const id = useRecordId();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { loading } = useLoad(async () => {
    if (!id) return;
    const semester = await semesters.show(id);
    setStartDate(parseDate(semester.startDate));
    setEndDate(parseDate(semester.endDate));
  }, [id]);

  const save = () => {
    const input = { startDate: toDateOnly(startDate!), endDate: toDateOnly(endDate!) };
    return id ? semesters.update(id, input) : semesters.create(input);
  };

  return (
    <FormCard
      title={id ? 'Alterar semestre' : 'Novo semestre'}
      loading={loading && id !== null}
      onSubmit={save}
      success={id ? 'Semestre alterado' : 'Semestre criado'}
    >
      <DatePicker label="Início" value={startDate} onChange={setStartDate} slotProps={{ textField: { required: true } }} />
      <DatePicker label="Fim" value={endDate} onChange={setEndDate} slotProps={{ textField: { required: true } }} />
    </FormCard>
  );
}
