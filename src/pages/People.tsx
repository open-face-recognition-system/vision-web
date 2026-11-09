import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Delete, Edit } from '@mui/icons-material';
import { TextField } from '@mui/material';
import DataTable from '../components/DataTable';
import FormCard from '../components/FormCard';
import { PersonInput, students, teachers } from '../resources';
import useLoad from '../useLoad';
import useRecordId from '../useRecordId';

type Kind = 'students' | 'teachers';

const KINDS = {
  students: { resource: students, plural: 'Alunos', singular: 'aluno', details: true },
  teachers: { resource: teachers, plural: 'Professores', singular: 'professor', details: false },
} as const;

export function PersonList({ kind }: { kind: Kind }) {
  const navigate = useNavigate();
  const { resource, plural, singular, details } = KINDS[kind];

  return (
    <DataTable
      title={plural}
      load={resource.list}
      searchable
      onAdd={() => navigate(`/${kind}/new`)}
      onRowClick={details ? person => navigate(`/${kind}/${person.id}`) : undefined}
      columns={[
        { label: 'Nome', render: person => person.user.name },
        { label: 'E-mail', render: person => person.user.email },
        { label: 'Matrícula', render: person => person.enrollment },
      ]}
      actions={[
        { label: 'Editar', icon: <Edit />, run: person => navigate(`/${kind}/${person.id}/edit`) },
        {
          label: 'Excluir',
          icon: <Delete />,
          confirm: `Deseja realmente excluir este ${singular}? A conta de acesso também será removida.`,
          success: `${singular[0].toUpperCase()}${singular.slice(1)} excluído`,
          run: person => resource.remove(person as never),
        },
      ]}
    />
  );
}

export function PersonForm({ kind }: { kind: Kind }) {
  const id = useRecordId();
  const { resource, singular } = KINDS[kind];
  const [person, setPerson] = useState<PersonInput>({ name: '', email: '', enrollment: '', password: '' });
  const field = (key: keyof PersonInput) => ({
    value: person[key] ?? '',
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => setPerson({ ...person, [key]: event.target.value }),
  });

  const { loading } = useLoad(async () => {
    if (!id) return;
    const { user, enrollment } = await resource.show(id);
    setPerson({ name: user.name, email: user.email, enrollment });
  }, [id, resource]);

  return (
    <FormCard
      title={id ? `Alterar ${singular}` : `Novo ${singular}`}
      loading={loading && id !== null}
      onSubmit={() => (id ? resource.update(id, person) : resource.create(person))}
      success={id ? 'Cadastro alterado' : 'Cadastro criado'}
    >
      <TextField label="Nome" required {...field('name')} />
      <TextField label="E-mail" type="email" required {...field('email')} />
      <TextField label="Matrícula" required disabled={id !== null} {...field('enrollment')} />
      {!id && (
        <TextField
          label="Senha inicial"
          type="password"
          required
          helperText="Mínimo de 6 caracteres. Compartilhe com a pessoa para o primeiro acesso."
          slotProps={{ htmlInput: { minLength: 6 } }}
          {...field('password')}
        />
      )}
    </FormCard>
  );
}
