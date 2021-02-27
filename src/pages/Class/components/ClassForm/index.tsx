/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useState, useCallback } from 'react';
import { Grid, TextField, MenuItem } from '@material-ui/core';
import { DatePicker, TimePicker } from '@material-ui/pickers';
import { useHistory } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import Paper from '../../../../components/Paper';
import Title from '../../../../components/Title';
import Button from '../../../../components/Button';
import LoadingButton from '../../../../components/LoadingButton';

import CreateClassRequest from '../../../../dtos/CreateClassRequest';
import { ClassItem } from '../../../../hooks/class';
import { Semester } from '../../../../hooks/semester';
import { Subject } from '../../../../hooks/subject';

interface ClassFormProps {
  title: string;
  actionTitle: string;
  defaultClass?: ClassItem | null;
  handleFormLoading: boolean;
  clearAllFields?: boolean;
  subjects: Subject[];
  semesters: Semester[];
  handleForm: (params: CreateClassRequest) => Promise<void>;
}

const ClassForm: React.FC<ClassFormProps> = ({
  title,
  actionTitle,
  defaultClass,
  handleFormLoading,
  clearAllFields,
  subjects,
  semesters,
  handleForm,
}: ClassFormProps) => {
  const history = useHistory();

  const [startHour, setStartHour] = useState(defaultClass?.startHour || null);
  const [endHour, setEndHour] = useState(defaultClass?.endHour || null);
  const [date, setDate] = useState(defaultClass?.date || null);
  const [subjectId, setSubjectId] = useState<number | null>(defaultClass?.subject?.id || null);
  const [semesterId, setSemesterId] = useState<number | null>(defaultClass?.semester?.id || null);

  const getFormatedDate = useCallback((semester: Semester) => {
    const startDate = parseISO(String(semester.startDate));
    const endDate = parseISO(String(semester.endDate));
    const formattedStartDate = format(startDate, 'dd/MM/yyyy');
    const formattedEndDate = format(endDate, 'dd/MM/yyyy');
    return `${formattedStartDate} - ${formattedEndDate}`
  }, [])

  return (
    <Paper>
      <Title title={title} />
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TimePicker
              clearable
              fullWidth
              inputVariant="outlined"
              ampm={false}
              label="Hora início"
              value={startHour}
              onChange={hour => {
                setStartHour(hour as Date);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TimePicker
              clearable
              fullWidth
              inputVariant="outlined"
              ampm={false}
              label="Hora fim"
              value={endHour}
              onChange={hour => {
                setEndHour(hour as Date);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              inputVariant="outlined"
              fullWidth
              variant="inline"
              label="Data"
              format="dd/MM/yyyy"
              value={date}
              onChange={newDate => {
                setDate(newDate as Date);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              name="subject"
              label="Matéria"
              fullWidth
              value={subjectId}
              select
              onChange={event => {
                setSubjectId(Number(event.target.value))
              }}
            >
              {subjects.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              name="semester"
              label="Semestre"
              fullWidth
              value={semesterId}
              select
              onChange={event => {
                setSemesterId(Number(event.target.value))
              }}
            >
              {semesters.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {getFormatedDate(option)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              {handleFormLoading ? (
                <LoadingButton color="primary" />
              ) : (
                  <Button
                    text={actionTitle}
                    color="primary"
                    onClick={e => {
                      e.preventDefault();
                      handleForm({
                        startHour,
                        endHour,
                        date,
                        subjectId,
                        semesterId
                      });
                      if (clearAllFields) {
                        setStartHour(null);
                        setEndHour(null);
                        setDate(null);
                        setSubjectId(null);
                        setSemesterId(null);
                      }
                    }}
                  />
                )}
              <Button
                text="Cancelar"
                color="secondary"
                variant="text"
                onClick={() => {
                  history.goBack();
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

ClassForm.defaultProps = {
  defaultClass: null,
  clearAllFields: false,
};

export default ClassForm;
