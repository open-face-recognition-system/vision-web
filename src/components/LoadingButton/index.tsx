import React from 'react';
import { Button as MaterialButton, CircularProgress } from '@material-ui/core';

interface LoadingButtonProps {
  color: 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  color,
}: LoadingButtonProps) => {
  return (
    <MaterialButton variant="contained" color={color} disabled>
      <CircularProgress size={14} />
    </MaterialButton>
  );
};

export default LoadingButton;
