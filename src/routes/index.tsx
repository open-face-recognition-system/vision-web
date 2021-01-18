import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import ListStudent from '../pages/Student/List';
import CreateStudent from '../pages/Student/Create';
import UpdateStudent from '../pages/Student/Update';
import DetailsStudent from '../pages/Student/Details';
import ListTeacher from '../pages/Teacher/List';
import CreateTeacher from '../pages/Teacher/Create';
import UpdateTeacher from '../pages/Teacher/Update';
import ListSubjects from '../pages/Subject/List';
import CreateSubject from '../pages/Subject/Create';
import UpdateSubject from '../pages/Subject/Update';
import ListSemesters from '../pages/Semester/List';
import CreateSemesters from '../pages/Semester/Create';
import UpdateSemesters from '../pages/Semester/Update';
import ListClasses from '../pages/Class/List';
import CreateClass from '../pages/Class/Create';
import UpdateClass from '../pages/Class/Update';
import listAttendances from '../pages/Attendance/List';

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

    <Route path="/students" exact component={ListStudent} isPrivate />
    <Route path="/students/create" exact component={CreateStudent} isPrivate />
    <Route
      path="/students/:id/update"
      exact
      component={UpdateStudent}
      isPrivate
    />
    <Route
      path="/students/:id/details"
      exact
      component={DetailsStudent}
      isPrivate
    />

    <Route path="/teachers" exact component={ListTeacher} isPrivate />
    <Route path="/teachers/create" exact component={CreateTeacher} isPrivate />
    <Route
      path="/teachers/:id/update"
      exact
      component={UpdateTeacher}
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

    <Route path="/classes" exact component={ListClasses} isPrivate />
    <Route path="/classes/create" exact component={CreateClass} isPrivate />
    <Route path="/classes/:id/update" exact component={UpdateClass} isPrivate />
    <Route
      path="/classes/:id/attendances"
      exact
      component={listAttendances}
      isPrivate
    />
  </Switch>
);

export default Routes;
