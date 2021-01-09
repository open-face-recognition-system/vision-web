/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
import React, { useCallback, useState } from 'react';
import { Grid } from '@material-ui/core';

import { useHistory } from 'react-router-dom';
import Paper from '../../../../components/Paper';
import Title from '../../../../components/Title';
import TextField from '../../../../components/TextField';
import Button from '../../../../components/Button';
import LoadingButton from '../../../../components/LoadingButton';
import AutocompleteTextField from '../../../../components/AutocompleteTextField';

import { Teacher, useTeacher } from '../../../../hooks/teacher';
import CreateSubjectRequest from '../../../../dtos/CreateSubjectRequest'
import { Subject } from '../../../../hooks/subject';


interface SubjectFormProps {
  title: string;
  actionTitle: string;
  defaultSubject?: Subject | null;
  handleFormLoading: boolean;
  clearAllFields?: boolean;
  handleForm: (params: CreateSubjectRequest) => Promise<void>;
}


const SubjectForm: React.FC<SubjectFormProps> = ({
  title,
  actionTitle,
  defaultSubject,
  handleFormLoading,
  clearAllFields,
  handleForm,
}: SubjectFormProps) => {
  const history = useHistory();
  const { listTeachers } = useTeacher();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(defaultSubject?.name || "");
  const [course, setCourse] = useState(defaultSubject?.course || "");
  const [description, setDescription] = useState(defaultSubject?.description || "");
  const [teacher, setTeacher] = useState<Teacher>(defaultSubject?.teacher || {} as Teacher);

  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const handleChangeTeacher = useCallback(
    async (teacherName) => {
      if (teacherName) {
        const query = {
          name: teacherName,
        };
        setLoading(true);
        const teachersResponse = await listTeachers(
          {
            page: 1,
            limit: 100,
          },
          query,
        );
        setLoading(false);
        setTeachers(teachersResponse.data);
      }
    },
    [listTeachers],
  );


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
            <AutocompleteTextField
              open={open}
              name="teacher"
              label="Professor"
              loading={loading}
              defaultEntity={teacher}
              entities={teachers}
              setValue={handleChangeTeacher}
              setEntity={setTeacher}
              setOpen={setOpen}
            />
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
                        teacherId: teacher?.id,
                      });
                      if (clearAllFields) {
                        setName("")
                        setCourse("")
                        setDescription("")
                        setTeacher({} as Teacher)
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

SubjectForm.defaultProps = {
  defaultSubject: null,
  clearAllFields: false
}

export default SubjectForm;
