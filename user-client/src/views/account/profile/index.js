import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import UpdateInfoContainer from '../../../containers/UpdateInfoContainer';

const Profile = () => {
  return (
    <div>
      <Tabs defaultActiveKey='profile' id='tab-profile'>
        <Tab eventKey='profile' title='Profile'>
          <div className='mt-4'>
            <UpdateInfoContainer />
          </div>
        </Tab>
        <Tab eventKey='avatar' title='Avatar'>
          avatar
        </Tab>
        <Tab eventKey='skills' title='Skill tags'>
          skills
        </Tab>
        <Tab eventKey='introduce' title='Introduce'>
          introduce
        </Tab>
      </Tabs>
    </div>
  );
};

export default Profile;
