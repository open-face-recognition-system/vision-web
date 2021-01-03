import React from 'react';
import { Typography } from '@material-ui/core';

interface TitleProps {
  title: string;
}

const Title: React.FC<TitleProps> = ({ title }: TitleProps) => {
  return (
    <Typography variant="h6" gutterBottom style={{ marginBottom: 16 }}>
      {title}
    </Typography>
  );
};

export default Title;
