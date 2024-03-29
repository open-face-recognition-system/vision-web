import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import ptLocale from 'date-fns/locale/pt-BR';
import { BrowserRouter as Router } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Routes from './routes';
import AppProvider from './hooks';
import { theme } from './theme';

const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
          <ThemeProvider theme={theme}>
            <Routes />
          </ThemeProvider>
        </MuiPickersUtilsProvider>
      </AppProvider>
    </Router>
  );
};

export default App;
