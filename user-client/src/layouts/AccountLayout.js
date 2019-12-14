import React from 'react';
import routes from '../routes';
import { Route, Redirect } from 'react-router-dom';
import TokenStorage from '../utils/TokenStorage';
import ROLE from '../constance/Role';
import { Row, Col } from 'react-bootstrap';
import Sidebar from '../components/sidebar/Sidebar';
import HeaderAccountContainer from '../containers/HeaderAccountContainer';

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

  const account = TokenStorage.decode();

  if (!account) {
    return <Redirect to='/login' />;
  }

  if (account.role !== ROLE.student && account.role !== ROLE.teacher) {
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
        <HeaderAccountContainer />
      </div>
      <div style={{ padding: 0 }}>
        <Row className='account-layout' noGutters>
          <Col
            xs={12}
            md={3}
            xl={2}
            className='sidebar'
            style={{ marginTop: 15 }}
          >
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
