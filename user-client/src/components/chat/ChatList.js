import React from 'react';
import { ListGroup, Image } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import avatarDefault from '../../assets/imgs/avatar.jpg';

const ChatList = () => {
  return (
    <div>
      <ListGroup className='chat-list' variant='flush'>
        <ListGroup.Item className='chat-item'>
          <NavLink
            className='user rounded no-effect'
            activeClassName='selected-chat'
            to='/account/messages/7fg987987734t97'
          >
            <Image src={avatarDefault} width={35} height={35} roundedCircle />
            <div className='right-block d-none d-lg-block'>
              <p className='user-name'>Leah Gotti</p>
              {/* <p className='msg-text'>hello</p> */}
            </div>
          </NavLink>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default ChatList;
