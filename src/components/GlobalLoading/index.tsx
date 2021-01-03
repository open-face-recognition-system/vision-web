import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { Backdrop } from './styles';

interface GlobalLoading {
  open: boolean;
}

const GlobalLoading: React.FC<GlobalLoading> = ({ open }: GlobalLoading) => {
  return (
    <Backdrop open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default GlobalLoading;
