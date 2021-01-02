import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './routes';

import AppProvider from './hooks';

const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <Routes />
      </AppProvider>
    </Router>
  );
};

export default App;
