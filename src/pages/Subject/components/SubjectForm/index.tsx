/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useEffect, useState, ChangeEvent } from 'react';
import { Grid, Button as MaterialButton, MenuItem, TextField as MaterialTextField } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useHistory } from 'react-router-dom';
import Paper from '../../../../components/Paper';
import Title from '../../../../components/Title';
import TextField from '../../../../components/TextField';
import Button from '../../../../components/Button';
import LoadingButton from '../../../../components/LoadingButton';

import { Teacher, useTeacher } from '../../../../hooks/teacher';
import CreateSubjectRequest from '../../../../dtos/CreateSubjectRequest'
import { Subject } from '../../../../hooks/subject';


interface SubjectFormProps {
  title: string;
  actionTitle: string;
  defaultSubject?: Subject | null;
  handleFormLoading: boolean;
  handleTrainingLoading?: boolean;
  isUpdate?: boolean;
  clearAllFields?: boolean;
  handleForm: (params: CreateSubjectRequest) => Promise<void>;
  handleTraining: () => Promise<void>;
  handleUploadPdf: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
}


const SubjectForm: React.FC<SubjectFormProps> = ({
  title,
  actionTitle,
  defaultSubject,
  isUpdate,
  handleFormLoading,
  handleTrainingLoading,
  clearAllFields,
  handleForm,
  handleTraining,
  handleUploadPdf
}: SubjectFormProps) => {
  const history = useHistory();
  const { listTeachers } = useTeacher();

  const [name, setName] = useState(defaultSubject?.name || "");
  const [course, setCourse] = useState(defaultSubject?.course || "");
  const [description, setDescription] = useState(defaultSubject?.description || "");
  const [teacherId, setTeacherId] = useState<number | null>(defaultSubject?.teacher?.id || null);

  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    async function getAllTeachers(): Promise<void> {
      const subjectsResponse = await listTeachers({
        page: 1,
        limit: 100,
      });
      setTeachers(subjectsResponse.data);
    }

    getAllTeachers();
  }, [listTeachers]);


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
              label="Curso"
              name="course"
              value={course}
              disabled={false}
              setValue={setCourse}
            />
          </Grid>
          <Grid item xs={12}>
            <MaterialTextField
              variant="outlined"
              name="teacher"
              label="Professor"
              fullWidth
              value={teacherId}
              select
              onChange={event => {
                setTeacherId(Number(event.target.value))
              }}
            >
              {teachers.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.user.name}
                </MenuItem>
              ))}
            </MaterialTextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descrição"
              name="description"
              value={description}
              disabled={false}
              setValue={setDescription}
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
                    onClick={(e) => {
                      e.preventDefault();
                      handleForm({
                        name,
                        course,
                        description,
                        teacherId
                      });
                      if (clearAllFields) {
                        setName("")
                        setCourse("")
                        setDescription("")
                        setTeacherId(null)
                      }
                    }}
                  />
                )}
              {isUpdate && (
                <>
                  {handleTrainingLoading ? (
                    <LoadingButton color="primary" />
                  ) : (
                      <Button
                        text="Treinar"
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          handleTraining();
                        }}
                      />
                    )}
                  <label htmlFor="upload-pdf">
                    <input
                      style={{ display: "none" }}
                      id="upload-pdf"
                      name="upload-pdf"
                      type="file"
                      onChange={(e) => {
                        handleUploadPdf(e)
                      }}
                    />
                    <MaterialButton
                      variant="contained"
                      color="primary"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload PDF
                    </MaterialButton>
                  </label>
                </>

              )}

              <Button
                variant="text"
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

SubjectForm.defaultProps = {
  defaultSubject: null,
  clearAllFields: false,
  isUpdate: false,
  handleTrainingLoading: false
}

export default SubjectForm;
