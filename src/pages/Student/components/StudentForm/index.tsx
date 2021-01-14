/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useState } from 'react';
import { Grid } from '@material-ui/core';

import { useHistory } from 'react-router-dom';
import Paper from '../../../../components/Paper';
import Title from '../../../../components/Title';
import TextField from '../../../../components/TextField';
import Button from '../../../../components/Button';
import LoadingButton from '../../../../components/LoadingButton';

import { Student } from '../../../../hooks/student';
import CreateStudentRequest from '../../../../dtos/CreateStudentRequest'


interface StudentFormProps {
  title: string;
  actionTitle: string;
  defaultStudent?: Student | null;
  isUpdate?: boolean;
  handleFormLoading: boolean;
  clearAllFields?: boolean;
  handleForm: (params: CreateStudentRequest) => Promise<void>;
}


const StudentForm: React.FC<StudentFormProps> = ({
  title,
  actionTitle,
  defaultStudent,
  isUpdate,
  handleFormLoading,
  clearAllFields,
  handleForm,
}: StudentFormProps) => {
  const history = useHistory();

  const [name, setName] = useState(defaultStudent?.user?.name || "");
  const [email, setEmail] = useState(defaultStudent?.user?.email || "");
  const [enrollment, setEnrollment] = useState(defaultStudent?.enrollment || "");

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
            <TextField
              label="Nome"
              name="name"
              value={name}
              disabled={false}
              setValue={setName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="E-mail"
              name="email"
              value={email}
              disabled={false}
              setValue={setEmail}
            />
          </Grid>
          {
            !isUpdate && (
              <Grid item xs={12}>
                <TextField
                  label="Matrícula"
                  name="enrollment"
                  value={enrollment}
                  disabled={false}
                  setValue={setEnrollment}
                />
              </Grid>
            )
          }
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
                    onClick={(e) => {
                      e.preventDefault();
                      handleForm({
                        name,
                        email,
                        enrollment
                      });
                      if (clearAllFields) {
                        setName("")
                        setEmail("")
                        setEnrollment("")
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

StudentForm.defaultProps = {
  defaultStudent: null,
  isUpdate: false,
  clearAllFields: false
}

export default StudentForm;
