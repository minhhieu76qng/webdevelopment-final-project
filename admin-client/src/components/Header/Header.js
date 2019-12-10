import React from 'react';
import { Menu, Avatar, Dropdown } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import TokenStorage from '../../utils/TokenStorage';

const HeaderPage = () => {
  const history = useHistory();

  const onLogOutClick = () => {
    TokenStorage.remove();
    history.push('/login');
  };

  const submenu = () => (
    <Menu>
      <Menu.Item>
        <Link to='/admin/account'>Account</Link>
      </Menu.Item>
      <Menu.Item onClick={onLogOutClick}>Log Out</Menu.Item>
    </Menu>
  );

  const account = TokenStorage.decode();
  let avatar = null;
  if (account && account.avatar) {
    avatar = {
      src: account.avatar,
    };
  } else {
    avatar = {
      icon: 'user',
    };
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '64px',
      }}
    >
      {account && (
        <Dropdown overlay={submenu}>
          <Avatar size={50} {...avatar} />
        </Dropdown>
      )}
    </div>
  );
};

export default HeaderPage;
