import React from 'react';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackMessage } from '../../hooks/snackbar';

import { useSnack } from '../../hooks/snackbar';

interface SnackProps {
  snack: SnackMessage;
}
function Alert(props: AlertProps): any {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Snack: React.FC<SnackProps> = ({ snack }) => {
  const { closeSnack } = useSnack();
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snack.open}
        message={snack.title}
        key={snack.title}
        onClose={closeSnack}
      >
        <Alert onClose={closeSnack} severity={snack.type}>
          {snack.title}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Snack;
