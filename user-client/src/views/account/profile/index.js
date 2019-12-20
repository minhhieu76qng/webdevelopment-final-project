import React, { useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import UpdateInfoContainer from '../../../containers/UpdateInfoContainer';
import ROLE from '../../../constance/Role';
import TeachingInfo from './TeachingInfo';

const Profile = ({ account, fetchCities }) => {
  useEffect(() => {
    fetchCities();
  }, [fetchCities]);
  return (
    <div className='profile'>
      <Tabs defaultActiveKey='profile' id='tab-profile'>
        <Tab eventKey='profile' title='Profile'>
          <div className='mt-4'>
            <UpdateInfoContainer />
          </div>
        </Tab>
        {account && account.role === ROLE.teacher && (
          <Tab eventKey='teaching' title='Teaching'>
            <div className='mt-4'>
              <TeachingInfo />
            </div>
          </Tab>
        )}
        {account && account.role === ROLE.teacher && (
          <Tab eventKey='introduce' title='Introduce'>
            introduce
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

export default Profile;
