import React from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import TokenStorage from '../utils/TokenStorage';

const ProtectedRoute = ({ path, render, ...props }) => {
  const location = useLocation();
  if (!TokenStorage.isValid()) {
    return (
      <Redirect to={{ pathname: '/login', state: { ...location.state } }} />
    );
  }

  return <Route path={path} render={render} {...props} />;
};

export default ProtectedRoute;
