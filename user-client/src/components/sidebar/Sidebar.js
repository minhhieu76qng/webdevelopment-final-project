import React from 'react';
import _ from 'lodash';
import { ListGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ routes }) => {
  return (
    <div>
      <ListGroup as='ul'>
        {_.isArray(routes) &&
          routes.map(route => {
            if (route.redirectPath) {
              return null;
            }
            return (
              <ListGroup.Item as='li' key={route.path}>
                <NavLink
                  className='d-block'
                  activeClassName='active-link'
                  to={route.layout + route.path}
                >
                  <span className='d-inline-block' style={{ minWidth: 20 }}>
                    {route.icon}
                  </span>
                  <span className='ml-2'>{route.name}</span>
                </NavLink>
              </ListGroup.Item>
            );
          })}
      </ListGroup>
    </div>
  );
};

export default Sidebar;
