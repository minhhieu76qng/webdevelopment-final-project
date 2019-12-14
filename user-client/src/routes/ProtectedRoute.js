import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import TokenStorage from '../utils/TokenStorage';

const ProtectedRoute = ({ path, render, ...props }) => {
  if (!TokenStorage.isValid()) {
    return <Redirect to='/login' />;
  }

  return <Route path={path} render={render} {...props} />;
};

export default ProtectedRoute;
