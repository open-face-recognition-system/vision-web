import React from 'react';
import { Button as MaterialButton } from '@material-ui/core';

interface ButtonProps {
  text: string;
  color: 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
  onClick: (params: any) => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  color,
  onClick,
}: ButtonProps) => {
  return (
    <MaterialButton variant="contained" color={color} onClick={onClick}>
      {text}
    </MaterialButton>
  );
};

export default Button;
