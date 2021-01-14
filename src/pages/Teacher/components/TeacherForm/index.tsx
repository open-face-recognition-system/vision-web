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

import { Teacher } from '../../../../hooks/teacher';
import CreateTeacherRequest from '../../../../dtos/CreateTeacherRequest'


interface TeacherFormProps {
  title: string;
  actionTitle: string;
  defaultTeacher?: Teacher | null;
  isUpdate?: boolean;
  handleFormLoading: boolean;
  clearAllFields?: boolean;
  handleForm: (params: CreateTeacherRequest) => Promise<void>;
}


const TeacherForm: React.FC<TeacherFormProps> = ({
  title,
  actionTitle,
  defaultTeacher,
  isUpdate,
  handleFormLoading,
  clearAllFields,
  handleForm,
}: TeacherFormProps) => {
  const history = useHistory();

  const [name, setName] = useState(defaultTeacher?.user?.name || "");
  const [email, setEmail] = useState(defaultTeacher?.user?.email || "");
  const [enrollment, setEnrollment] = useState(defaultTeacher?.enrollment || "");

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
          {!isUpdate && (
            <Grid item xs={12}>
              <TextField
                label="Matrícula"
                name="enrollment"
                value={enrollment}
                disabled={false}
                setValue={setEnrollment}
              />
            </Grid>
          )}
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

TeacherForm.defaultProps = {
  defaultTeacher: null,
  isUpdate: false,
  clearAllFields: false
}

export default TeacherForm;
