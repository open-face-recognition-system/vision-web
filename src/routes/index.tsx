import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import StudentList from '../pages/Student/List';
import StudentCreate from '../pages/Student/Create';
import TeacherList from '../pages/Teacher/List';
import TeacherCreate from '../pages/Teacher/Create';
import ListSubjects from '../pages/Subject/List';
import CreateSubject from '../pages/Subject/Create';
import UpdateSubject from '../pages/Subject/Update';
import ListSemesters from '../pages/Semester/List';
import CreateSemesters from '../pages/Semester/Create';
import UpdateSemesters from '../pages/Semester/Update';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/dashboard" component={Dashboard} isPrivate />

    <Route path="/semesters" exact component={ListSemesters} isPrivate />
    <Route
      path="/semesters/create"
      exact
      component={CreateSemesters}
      isPrivate
    />
    <Route
      path="/semesters/:id/update"
      exact
      component={UpdateSemesters}
      isPrivate
    />

    <Route path="/students" exact component={StudentList} isPrivate />
    <Route path="/students/create" exact component={StudentCreate} isPrivate />
    <Route
      path="/students/:id/update"
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

    <Route path="/subjects" exact component={ListSubjects} isPrivate />
    <Route path="/subjects/create" exact component={CreateSubject} isPrivate />
    <Route
      path="/subjects/:id/update"
      exact
      component={UpdateSubject}
      isPrivate
    />
  </Switch>
);

export default Routes;
