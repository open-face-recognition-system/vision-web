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
  TableHead,
  Chip,
} from '@material-ui/core';

import { useHistory } from 'react-router-dom';

import { useStyles } from './styles';
import { Subject, useSubject } from '../../../hooks/subject';

const CustomPaginationActionsTable: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const { listSubjects } = useSubject();

  const [currentPage, setCurrentPage] = React.useState(0);
  const [perPage, setPerPage] = React.useState(15);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const [subjects, setSubjects] = React.useState<Subject[]>([]);

  useEffect(() => {
    async function getAllSubjects(): Promise<void> {
      setLoading(true);
      const subjectsResponse = await listSubjects({
        page: currentPage + 1,
        per_page: perPage,
      });
      setSubjects(subjectsResponse.data);
      setCurrentPage(subjectsResponse.current_page - 1);
      setPerPage(subjectsResponse.per_page);
      setTotal(subjectsResponse.total);
      setLoading(false);
    }

    getAllSubjects();
  }, [listSubjects, currentPage, perPage]);

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
            history.push('/subjects/create');
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
                  <TableCell align="left">Curso</TableCell>
                  <TableCell align="left">Professor</TableCell>
                  <TableCell align="left" />
                  <TableCell align="left" />
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.course}
                    </TableCell>
                    <TableCell align="left">{row.teacher.user.name}</TableCell>
                    <TableCell align="left">
                      {row.recognitionFile ? (
                        <Chip label="Treinado" />
                      ) : (
                          <Chip label="Não treinado" color="secondary" />
                        )}
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        color="primary"
                        onClick={() => {
                          history.push(`/subjects/${row.id}/update`);
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
