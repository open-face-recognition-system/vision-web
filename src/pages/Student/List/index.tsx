/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useEffect } from 'react';

import Table from '@material-ui/core/Table';
import AddIcon from '@material-ui/icons/Add';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { useHistory } from 'react-router-dom';

import { useStyles } from "./styles"
import { Student, useStudent } from '../../../hooks/student';


const CustomPaginationActionsTable: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const { listStudents } = useStudent()

  const [page, setPage] = React.useState(0);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(() => {
    async function getAllStudents(): Promise<void> {
      const studentsResponse = await listStudents()
      setStudents(studentsResponse)
    }

    getAllStudents()
  }, [listStudents]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          history.push("/create-student")
        }}
        endIcon={<AddIcon />}
      >
        Adicionar novo
      </Button>
      <TableContainer component={Paper}>
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
                <TableCell align="left">
                  {row.enrollment}
                </TableCell>
                <TableCell align="right">
                  <Button
                    color="primary"
                    onClick={
                      () => {
                        history.push(`/create-student/${row.id}`)
                      }
                    }
                  >detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={3}
                count={students.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>

  );
};

export default CustomPaginationActionsTable
