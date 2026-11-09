import { createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';

export default createTheme(
  {
    palette: {
      primary: { light: '#40556b', main: '#162c40', dark: '#00001a', contrastText: '#fff' },
      secondary: { light: '#ff7661', main: '#EF4136', dark: '#C1282A', contrastText: '#000' },
    },
  },
  ptBR,
);
