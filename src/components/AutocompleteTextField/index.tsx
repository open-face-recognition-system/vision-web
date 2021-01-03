import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { CircularProgress, TextField } from '@material-ui/core';

interface AutocompleteTextFieldProps {
  open: boolean;
  name: string;
  label: string;
  loading: boolean;
  defaultEntity: any;
  entities: any[];
  setValue: (value: string) => void;
  setEntity: (value: any) => void;
  setOpen: (open: boolean) => void;
}
const AutocompleteTextField: React.FC<AutocompleteTextFieldProps> = ({
  open,
  name,
  label,
  loading,
  defaultEntity,
  entities,
  setValue,
  setEntity,
  setOpen,
}: AutocompleteTextFieldProps) => {
  return (
    <Autocomplete
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => {
        const selectedTeacher = option.id === value.id;
        if (selectedTeacher) {
          setEntity(value);
          return selectedTeacher;
        }
        return false;
      }}
      defaultValue={defaultEntity}
      getOptionLabel={option => option.user?.name}
      options={entities}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          name={name}
          label={label}
          fullWidth
          onChange={e => setValue(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default AutocompleteTextField;
