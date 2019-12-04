import React from 'react';
import { Redirect } from 'react-router-dom';
import DefaultRoute from './DefaultRoute';
import TokenStorage from '../utils/TokenStorage';

const ProtectedRoute = ({ children, ...params }) => {
  if (!TokenStorage.isValid()) {
    return <Redirect to='/login' />;
  }

  return <DefaultRoute {...params}>{children}</DefaultRoute>;
};

export default ProtectedRoute;
