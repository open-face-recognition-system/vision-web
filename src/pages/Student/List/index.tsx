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
  Backdrop
} from '@material-ui/core';

import { useHistory } from 'react-router-dom';

import { useStyles } from './styles';
import { Student, useStudent } from '../../../hooks/student';

const CustomPaginationActionsTable: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const { listStudents } = useStudent();

  const [currentPage, setCurrentPage] = React.useState(0);
  const [perPage, setPerPage] = React.useState(15);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const [students, setStudents] = React.useState<Student[]>([]);

  useEffect(() => {
    async function getAllStudents(): Promise<void> {
      setLoading(true)
      const studentsResponse = await listStudents({
        page: currentPage + 1,
        per_page: perPage,
      });
      setStudents(studentsResponse.data);
      setCurrentPage(studentsResponse.current_page - 1);
      setPerPage(studentsResponse.per_page);
      setTotal(studentsResponse.total);
      setLoading(false)
    }

    getAllStudents();
  }, [listStudents, currentPage, perPage]);

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
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          history.push('/create-student');
        }}
        endIcon={<AddIcon />}
      >
        Adicionar novo
      </Button>
      <TableContainer component={Paper}>
        {loading ? (
          <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
            <Table className={classes.table} aria-label="custom pagination table">
              <TableBody>
                {students.map(row => (
                  <TableRow key={row.user.id}>
                    <TableCell component="th" scope="row">
                      {row.user.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.user.email}
                    </TableCell>
                    <TableCell align="left">{row.enrollment}</TableCell>
                    <TableCell align="right">
                      <Button
                        color="primary"
                        onClick={() => {
                          history.push(`/create-student/${row.id}`);
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
