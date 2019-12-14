import React from 'react';
import routes from '../routes';
import { Route, Redirect, Switch } from 'react-router-dom';
import TokenStorage from '../utils/TokenStorage';
import ROLE from '../constance/Role';
import HeaderContainer from '../containers/HeaderContainer';

const PageLayout = () => {
  const account = TokenStorage.decode();
  if (account && account.role === ROLE.teacher) {
    return <Redirect to='/t' />;
  }

  const getRoutes = () => {
    return routes.student.map(route => {
      if (route.layout === '') {
        return (
          <Route
            path={route.layout + route.path}
            component={route.component}
            key={route.path}
          />
        );
      }

      return null;
    });
  };
  return (
    <>
      <HeaderContainer />
      <Switch>{getRoutes()}</Switch>
    </>
  );
};

export default PageLayout;
