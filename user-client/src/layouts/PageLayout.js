import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import routes from '../routes';
import TokenStorage from '../utils/TokenStorage';
import ROLE from '../constance/Role';
import HeaderContainer from '../containers/HeaderContainer';
import FooterContainer from '../containers/FooterContainer';

const PageLayout = () => {
  const account = TokenStorage.decode();
  if (account && account.role === ROLE.teacher) {
    return <Redirect to='/account' />;
  }

  const getRoutes = () => {
    return routes.student.map(route => {
      if (route.layout === '') {
        return (
          <Route
            exact={route.exact}
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
      <Container className='mt-4'>
        <Switch>{getRoutes()}</Switch>
      </Container>
      <FooterContainer />
    </>
  );
};

export default PageLayout;
