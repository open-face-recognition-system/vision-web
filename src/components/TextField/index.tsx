import React from 'react';
import { TextField as MaterialTextField } from '@material-ui/core';

interface TextFieldProps {
  disabled: boolean;
  name: string;
  label: string;
  value: string;
  setValue: (value: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({
  disabled,
  name,
  label,
  value,
  setValue,
}: TextFieldProps) => {
  return (
    <MaterialTextField
      variant="outlined"
      disabled={disabled}
      name={name}
      label={label}
      value={value}
      fullWidth
      onChange={e => setValue(e.target.value)}
    />
  );
};

export default TextField;
