import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import TokenStorage from '../utils/TokenStorage';

const PrivateRoute = ({ path, render }) => {
  const account = TokenStorage.isValid();

  if (!account) {
    return <Redirect to='/login' />;
  }
  return <Route path={path} render={render} />;
};

export default PrivateRoute;
