import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import StudentList from '../pages/Student/List';
import StudentCreate from '../pages/Student/Create';
import TeacherList from '../pages/Teacher/List';
import TeacherCreate from '../pages/Teacher/Create';
import SubjectList from '../pages/Subject/List';
import SubjectCreate from '../pages/Subject/Create';

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

    <Route path="/teachers" component={TeacherList} isPrivate />
    <Route path="/create-teacher" exact component={TeacherCreate} isPrivate />
    <Route
      path="/create-teacher/:id"
      exact
      component={TeacherCreate}
      isPrivate
    />

    <Route path="/subjects" component={SubjectList} isPrivate />
    <Route path="/create-subject" exact component={SubjectCreate} isPrivate />
    <Route
      path="/create-subject/:id"
      exact
      component={SubjectCreate}
      isPrivate
    />
  </Switch>
);

export default Routes;
