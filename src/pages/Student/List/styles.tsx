import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  gridContainer: {
    marginBottom: 8,
  },
  table: {
    minWidth: 100,
  },
  backdrop: {
    zIndex: 1200 + 1,
    color: '#fff',
  },
});
