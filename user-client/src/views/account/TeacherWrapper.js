import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';

const TeacherWrapper = ({ account, children }) => {
  if (account && account.teacher && !account.teacher.firstUpdated) {
    return <Redirect to='/account/welcome' />;
  }
  return <Switch>{children}</Switch>;
};
const mapStateToProps = state => {
  return {
    account: state.loggedAccount,
  };
};
export default connect(mapStateToProps)(TeacherWrapper);
