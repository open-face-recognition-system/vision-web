import styled from 'styled-components';
import { Backdrop as MaterialBackdrop } from '@material-ui/core';

export const Backdrop = styled(MaterialBackdrop)`
  z-index: 1200 + 1;
  color: '#fff';
`;
