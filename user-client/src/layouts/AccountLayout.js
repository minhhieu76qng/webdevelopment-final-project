import React from 'react';
import routes from '../routes';
import { Route, Redirect } from 'react-router-dom';
import TokenStorage from '../utils/TokenStorage';
import ROLE from '../constance/Role';
import { Row, Col, Jumbotron } from 'react-bootstrap';
import Sidebar from '../components/sidebar/Sidebar';
import HeaderAccount from '../components/header/HeaderAccount';

const AccountLayout = () => {
  const getStudentRoutes = () => {
    return routes.student.map(route => {
      if (route.layout === '/account') {
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

  const getTeacherRoutes = () => {
    return routes.teacher.map(route => {
      if (route.layout === '/t') {
        console.log(route);
        return (
          <Route
            path={route.layout + route.path}
            component={route.component}
            key={route.path}
          />
        );
      }
    });
  };

  const account = TokenStorage.decode();

  if (!account) {
    return <Redirect to='/login' />;
  }

  if (account.role !== ROLE.student && account.role !== ROLE.teacher) {
    console.log('a');
    return <Redirect to='/' />;
  }

  let links = null;
  if (account.role === ROLE.student) {
    links = routes.student.filter(val => val.layout === '/account');
  }
  if (account.role === ROLE.teacher) {
    links = routes.teacher;
  }
  return (
    <>
      <div id='header'>
        <HeaderAccount />
      </div>
      <div style={{ overflowX: 'hidden', padding: 0 }}>
        <Row className='account-layout' noGutters>
          <Col xs={12} md={3} xl={2} className='sidebar'>
            <Sidebar routes={links} />
          </Col>
          <Col xs={12} md={9} xl={10} className='page-content'>
            <div
              className='shadow'
              style={{ background: '#fff', margin: 15, padding: 15 }}
            >
              {account.role === ROLE.student && getStudentRoutes()}
              {account.role === ROLE.teacher && getTeacherRoutes()}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AccountLayout;
