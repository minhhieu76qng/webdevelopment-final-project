import React, { useEffect } from 'react';
import 'react-router-tabs/styles/react-router-tabs.css';
import { NavTab } from 'react-router-tabs';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import UpdateInfoContainer from '../../../containers/UpdateInfoContainer';
import ROLE from '../../../constance/Role';
import TeachingInfo from './TeachingInfo';
import UpdateIntro from './UpdateIntro';
import ChangePwContainer from '../../../containers/ChangePasswordContainer';

const Profile = ({ account, fetchCities }) => {
  const { url, path } = useRouteMatch();
  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return (
    <div className='profile'>
      <NavTab className='nav-tab  router-tabs' to={`${url}/basic`}>
        Basic information
      </NavTab>

      {account && account.role === ROLE.teacher && (
        <NavTab className='nav-tab  router-tabs' to={`${url}/teaching`}>
          Teaching
        </NavTab>
      )}
      {account && account.role === ROLE.teacher && (
        <NavTab className='nav-tab  router-tabs' to={`${url}/introduce`}>
          Introduce
        </NavTab>
      )}
      {account && !_.isEmpty(account.local) && (
        <NavTab className='nav-tab  router-tabs' to={`${url}/change-password`}>
          Settings
        </NavTab>
      )}

      <div className='mt-4'>
        <Switch>
          <Route exact path={`${path}/basic`} component={UpdateInfoContainer} />
          {account && account.role === ROLE.teacher && (
            <Route exact path={`${path}/teaching`} component={TeachingInfo} />
          )}
          {account && account.role === ROLE.teacher && (
            <Route exact path={`${path}/introduce`} component={UpdateIntro} />
          )}

          {account && !_.isEmpty(account.local) && (
            <Route
              exact
              path={`${path}/change-password`}
              component={ChangePwContainer}
            />
          )}

          <Redirect to={`${path}/basic`} />
        </Switch>
      </div>
    </div>
  );
};

export default Profile;
