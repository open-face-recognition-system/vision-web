/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
// eslint-disable-next-line prettier/prettier
import React from 'react';
import {
  RouteProps as ReactDOMRouteProps,
  Route as ReactDOMRoute,
  Redirect,
} from 'react-router-dom';
import { useAuth } from '../hooks/auth';

import AuthLayout from '../layout/auth'
import DefaultLayout from '../layout/default'

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();
  const signInRoute = '/';
  const dashboardRoute = '/dashboard';


  const Layout = user ? DefaultLayout : AuthLayout;

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Layout>
            <Component />
          </Layout>
        ) : (
            <Redirect
              to={{
                pathname: isPrivate ? signInRoute : dashboardRoute,
                state: { from: location },
              }}
            />
          );
      }}
    />
  );
};

export default Route;
