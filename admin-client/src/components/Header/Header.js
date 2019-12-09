import React from 'react';
import { Menu, Avatar, Dropdown } from 'antd';
import { Link } from 'react-router-dom';

const HeaderPage = () => {
  const submenu = () => (
    <Menu>
      <Menu.Item>
        <Link to='/admin/account'>Account</Link>
      </Menu.Item>
      <Menu.Item>Log Out</Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '64px',
      }}
    >
      <Dropdown overlay={submenu}>
        <Avatar size={50} icon='user' />
      </Dropdown>
    </div>
  );
};

export default HeaderPage;
