import React from 'react';

import { PaperContainer } from './styles';

const Paper: React.FC = ({ children }) => {
  return <PaperContainer>{children}</PaperContainer>;
};

export default Paper;
