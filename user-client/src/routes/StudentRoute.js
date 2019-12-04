import React from 'react';
import { Redirect } from 'react-router-dom';
import DefaultRoute from './DefaultRoute';
import TokenStorage from '../utils/TokenStorage';
import ROLE from '../constance/Role';

const StudentRoute = ({ children, ...params }) => {
  const account = TokenStorage.decode();

  if (account && account.role === ROLE.teacher) {
    return <Redirect to='/t' />;
  }

  if (account && account.role !== ROLE.student) {
    return <Redirect to='*' />;
  }

  return <DefaultRoute {...params}>{children}</DefaultRoute>;
};

export default StudentRoute;
