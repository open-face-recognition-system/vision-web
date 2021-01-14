/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useCallback, useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { DatePicker, TimePicker } from '@material-ui/pickers';
import { Autocomplete } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import { format, parseISO, isValid } from 'date-fns';
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
  const [subject, setSubject] = useState<Subject>(
    defaultClass?.subject || {} as Subject,
  );
  const [semester, setSemester] = useState<Semester>(
    defaultClass?.semester || {} as Semester,
  );

  const formatDate = useCallback((dateToFormat: Date) => {
    if (isValid(dateToFormat)) {
      const firstDate = parseISO(String(dateToFormat));
      const formattedDate = format(firstDate, 'dd/MM/yyyy');
      return formattedDate;
    }
    return ""
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
            <Autocomplete
              options={subjects}
              fullWidth
              defaultValue={subject}
              getOptionLabel={option => option?.name}
              getOptionSelected={(option, value) => {
                const selelectedSubject = option.id === value.id;
                if (selelectedSubject) {
                  setSubject(value);
                  return selelectedSubject;
                }
                return false;
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Matéria"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              options={semesters}
              fullWidth
              defaultValue={semester}
              getOptionSelected={(option, value) => {
                const selelectedSemester = option.id === value.id;
                if (selelectedSemester) {
                  setSemester(value);
                  return selelectedSemester;
                }
                return false;
              }}
              getOptionLabel={option => {
                if (defaultClass !== null) {
                  return `${formatDate(option.startDate)} - ${formatDate(option.endDate)}`
                }
                return ""
              }}
              renderInput={params => (
                <TextField {...params} label="Semestre" variant="outlined" />
              )}
            />
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
                        subjectId: subject?.id,
                        semesterId: semester?.id,
                      });
                      if (clearAllFields) {
                        setStartHour(null);
                        setEndHour(null);
                        setDate(null);
                        setSubject({} as Subject);
                        setSemester({} as Semester);
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
