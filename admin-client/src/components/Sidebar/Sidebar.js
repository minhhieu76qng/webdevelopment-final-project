import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'antd';
import { NavLink, Link, useHistory } from 'react-router-dom';
import _ from 'lodash';
import logo from '../../assets/imgs/logo.png';

const Sidebar = ({ routes, mode, theme }) => {
  const [selectedKey, setSelectedKey] = useState(0);
  const history = useHistory();

  useEffect(() => {
    if (_.isArray(routes)) {
      for (let i = 0; i < routes.length; i += 1) {
        if (history.location.pathname.indexOf(routes[i].path) !== -1) {
          setSelectedKey(routes[i].path);
          return;
        }
      }
    }
  }, [history.location.pathname, routes]);
  return (
    <>
      <div className='logo'>
        <Link to='/admin/dashboard'>
          <img style={{ maxWidth: '100%' }} src={logo} alt='Logo' />
        </Link>
      </div>
      {routes && _.isArray(routes) && (
        <Menu
          theme={theme}
          mode={mode}
          defaultSelectedKeys={[routes[0].path]}
          selectedKeys={[`${selectedKey}`]}
        >
          {routes.map(route => {
            return (
              <Menu.Item key={route.path}>
                <NavLink to={route.layout + route.path}>
                  <Icon type={route.icon} />
                  <span>{route.name}</span>
                </NavLink>
              </Menu.Item>
            );
          })}
        </Menu>
      )}
    </>
  );
};

export default Sidebar;
