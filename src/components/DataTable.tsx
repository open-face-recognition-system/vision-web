import { ReactNode, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import type { Page, PageQuery } from '../resources';
import useLoad from '../useLoad';
import { errorMessage, useNotify } from '../notify';
import ConfirmDialog from './ConfirmDialog';

export interface Column<T> {
  label: string;
  render: (row: T) => ReactNode;
}

export interface RowAction<T> {
  label: string;
  icon: ReactNode;
  run: (row: T) => unknown;
  confirm?: string;
  success?: string;
}

interface DataTableProps<T extends { id: number }> {
  title: string;
  columns: Column<T>[];
  load: (query: PageQuery) => Promise<Page<T>>;
  actions?: RowAction<T>[];
  onAdd?: () => void;
  onRowClick?: (row: T) => void;
  searchable?: boolean;
}

export default function DataTable<T extends { id: number }>({
  title,
  columns,
  load,
  actions = [],
  onAdd,
  onRowClick,
  searchable,
}: DataTableProps<T>) {
  const notify = useNotify();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [name, setName] = useState('');
  const [pending, setPending] = useState<{ action: RowAction<T>; row: T } | null>(null);

  const { data, loading, reload } = useLoad(
    () => load({ page: page + 1, limit, ...(name && { name }) }),
    [load, page, limit, name],
  );

  const run = async (action: RowAction<T>, row: T) => {
    setPending(null);
    try {
      await action.run(row);
      if (action.success) notify(action.success);
      await reload();
    } catch (error) {
      notify(errorMessage(error, `Erro ao ${action.label.toLowerCase()}`), 'error');
    }
  };

  const trigger = (action: RowAction<T>, row: T) => (action.confirm ? setPending({ action, row }) : run(action, row));

  return (
    <Paper sx={{ width: '100%' }}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {searchable && (
          <TextField
            size="small"
            placeholder="Pesquisar por nome"
            value={name}
            onChange={event => {
              setName(event.target.value);
              setPage(0);
            }}
          />
        )}
        {onAdd && (
          <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
            Adicionar
          </Button>
        )}
      </Toolbar>
      <Box sx={{ height: 4 }}>{loading && <LinearProgress />}</Box>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.label}>{column.label}</TableCell>
            ))}
            {actions.length > 0 && <TableCell align="right">Ações</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data.map(row => (
            <TableRow
              key={row.id}
              hover
              onClick={() => onRowClick?.(row)}
              sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map(column => (
                <TableCell key={column.label}>{column.render(row)}</TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell align="right" onClick={event => event.stopPropagation()}>
                  {actions.map(action => (
                    <Tooltip key={action.label} title={action.label}>
                      <IconButton aria-label={action.label} onClick={() => trigger(action, row)}>
                        {action.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                </TableCell>
              )}
            </TableRow>
          ))}
          {data?.data.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="center">
                Nenhum registro encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={data?.total ?? 0}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage="Por página"
        onPageChange={(_, next) => setPage(next)}
        onRowsPerPageChange={event => {
          setLimit(Number(event.target.value));
          setPage(0);
        }}
      />
      <ConfirmDialog
        open={pending !== null}
        title={pending?.action.label ?? ''}
        description={pending?.action.confirm ?? ''}
        onCancel={() => setPending(null)}
        onConfirm={() => pending && run(pending.action, pending.row)}
      />
    </Paper>
  );
}
