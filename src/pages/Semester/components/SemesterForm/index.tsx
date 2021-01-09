/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { useHistory } from 'react-router-dom';
import Paper from '../../../../components/Paper';
import Title from '../../../../components/Title';
import Button from '../../../../components/Button';
import LoadingButton from '../../../../components/LoadingButton';

import CreateSemesterRequest from '../../../../dtos/CreateSemesterRequest';
import { Semester } from '../../../../hooks/semester';

interface SemesterFormProps {
  title: string;
  actionTitle: string;
  defaultSemester?: Semester | null;
  handleFormLoading: boolean;
  clearAllFields?: boolean;
  handleForm: (params: CreateSemesterRequest) => Promise<void>;
}

const SemesterForm: React.FC<SemesterFormProps> = ({
  title,
  actionTitle,
  defaultSemester,
  handleFormLoading,
  clearAllFields,
  handleForm,
}: SemesterFormProps) => {
  const history = useHistory();

  const [startDate, setStartDate] = useState(
    defaultSemester?.startDate || null
  );
  const [endDate, setEndDate] = useState(defaultSemester?.endDate || null);

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
            <DatePicker
              inputVariant="outlined"
              fullWidth
              variant="inline"
              label="Data incício"
              format="dd/MM/yyyy"
              value={startDate}
              onChange={(date) => {
                setStartDate(date as Date)
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              inputVariant="outlined"
              fullWidth
              variant="inline"
              label="Data fim"
              format="dd/MM/yyyy"
              value={endDate}
              onChange={(date) => {
                setEndDate(date as Date)
              }}
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
                        startDate,
                        endDate,
                      });
                      if (clearAllFields) {
                        setStartDate(null);
                        setEndDate(null);
                      }
                    }}
                  />
                )}
              <Button
                text="Cancelar"
                color="secondary"
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

SemesterForm.defaultProps = {
  defaultSemester: null,
  clearAllFields: false,
};

export default SemesterForm;
