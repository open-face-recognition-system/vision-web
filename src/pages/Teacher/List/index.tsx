/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useEffect } from 'react';

import AddIcon from '@material-ui/icons/Add';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Backdrop,
  Grid,
  TableHead
} from '@material-ui/core';

import { useHistory } from 'react-router-dom';

import { useStyles } from './styles';
import { Teacher, useTeacher } from '../../../hooks/teacher';

const CustomPaginationActionsTable: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const { listTeachers } = useTeacher();

  const [currentPage, setCurrentPage] = React.useState(0);
  const [perPage, setPerPage] = React.useState(15);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const [teachers, setTeachers] = React.useState<Teacher[]>([]);

  useEffect(() => {
    async function getAllTeachers(): Promise<void> {
      setLoading(true)
      const teachersResponse = await listTeachers({
        page: currentPage + 1,
        per_page: perPage,
      });
      setTeachers(teachersResponse.data);
      setCurrentPage(teachersResponse.current_page - 1);
      setPerPage(teachersResponse.per_page);
      setTotal(teachersResponse.total);
      setLoading(false)
    }

    getAllTeachers();
  }, [listTeachers, currentPage, perPage]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ): void => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
        className={classes.gridContainer}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.push('/create-teacher');
          }}
          endIcon={<AddIcon />}
        >
          Novo
        </Button>
      </Grid>
      <TableContainer component={Paper}>
        {loading ? (
          <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
            <Table className={classes.table} aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Nome</TableCell>
                  <TableCell align="left">E-mail</TableCell>
                  <TableCell align="left">Matrícula</TableCell>
                  <TableCell align="left" />
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map(row => (
                  <TableRow key={row.user.id}>
                    <TableCell component="th" scope="row">
                      {row.user.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.user.email}
                    </TableCell>
                    <TableCell align="left">{row.enrollment}</TableCell>
                    <TableCell align="left">
                      <Button
                        color="primary"
                        onClick={() => {
                          history.push(`/create-teacher/${row.id}`);
                        }}
                      >
                        detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 15, 25]}
                    colSpan={3}
                    count={total}
                    rowsPerPage={perPage}
                    page={currentPage}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          )}

      </TableContainer>
    </>
  );
};

export default CustomPaginationActionsTable;
