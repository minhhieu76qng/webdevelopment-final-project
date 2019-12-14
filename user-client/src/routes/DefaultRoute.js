import React from 'react';
import { Route } from 'react-router-dom';

const DefaultRoute = ({ path, render }) => {
  return <Route path={path} render={render} />;
};

export default DefaultRoute;
