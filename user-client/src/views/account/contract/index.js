import React from 'react';
import { NavTab } from 'react-router-tabs/cjs/react-router-tabs.min';
import { useRouteMatch, Route, Switch, Redirect } from 'react-router-dom';
import ActiveContracts from './ActiveContracts';
import PendingContracts from './PendingContracts';

const Contract = () => {
  const { url, path } = useRouteMatch();
  return (
    <div>
      <NavTab className='nav-tab router-tabs' to={`${url}/active`}>
        Contracts
      </NavTab>
      <NavTab className='nav-tab router-tabs' to={`${url}/pending`}>
        Pending contracts
      </NavTab>

      <div className='mt-4'>
        <Switch>
          <Route exact path={`${path}/active`} component={ActiveContracts} />
          <Route exact path={`${path}/pending`} component={PendingContracts} />
          <Redirect to={`${path}/active`} />
        </Switch>
      </div>
    </div>
  );
};

export default Contract;
