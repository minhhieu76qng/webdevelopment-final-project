import React from 'react';
import { Route } from 'react-router-dom';
import Layout from '../components/layouts/Layout';

const DefaultRoute = ({ children, ...params }) => {
  return (
    <Route {...params}>
      <Layout>{children}</Layout>
    </Route>
  );
};

export default DefaultRoute;
