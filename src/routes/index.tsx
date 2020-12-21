import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import StudentList from '../pages/Student/List';
import StudentCreate from '../pages/Student/Create';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/students" component={StudentList} isPrivate />
    <Route path="/create-student" exact component={StudentCreate} isPrivate />
    <Route
      path="/create-student/:id"
      exact
      component={StudentCreate}
      isPrivate
    />
  </Switch>
);

export default Routes;
