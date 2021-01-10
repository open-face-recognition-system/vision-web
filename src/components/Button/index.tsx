import React from 'react';
import { Button as MaterialButton } from '@material-ui/core';

interface ButtonProps {
  text: string;
  color: 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
  variant?: 'text' | 'outlined' | 'contained' | undefined;
  onClick: (params: any) => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  color,
  variant,
  onClick,
}: ButtonProps) => {
  return (
    <MaterialButton variant={variant} color={color} onClick={onClick}>
      {text}
    </MaterialButton>
  );
};

Button.defaultProps = {
  variant: 'contained',
};

export default Button;
