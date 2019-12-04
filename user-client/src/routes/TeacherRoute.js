import React from 'react';
import { Redirect } from 'react-router-dom';
import DefaultRoute from './DefaultRoute';
import TokenStorage from '../utils/TokenStorage';
import Role from '../constance/Role';

const TeacherRoute = ({ children, ...params }) => {
  if (!TokenStorage.isValid()) {
    return <Redirect to='/login' />;
  }

  const account = TokenStorage.decode();
  if (account.role !== Role.teacher) {
    return <Redirect to='*' />;
  }
  return <DefaultRoute {...params}>{children}</DefaultRoute>;
};

export default TeacherRoute;
