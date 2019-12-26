import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ListGroup, Image } from 'react-bootstrap';
import { Link, Redirect, useLocation } from 'react-router-dom';
import Axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import Fade from 'react-reveal/Fade';
import shortid from 'shortid';
import queryString from 'query-string';
import avatarDefault from '../../assets/imgs/avatar.jpg';
import { toast } from '../widgets/toast';

const skeleton = new Array(5).fill(0);

const ChatList = () => {
  const qParams = queryString.parse(useLocation().search);
  const roomId = qParams.room;
  let { to } = qParams;
  const path = useLocation().pathname;
  if (!to) {
    const obj = queryString.parseUrl(path);
    if (obj.query) {
      to = obj.query.to;
    }
  }

  const [listRoom, setRooms] = useState([]);
  const [isCreated, setCreated] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const isUnmounted = useRef(false);

  const fetchRooms = () => {
    setFetching(true);
    Axios.get('/api/user/chats/rooms')
      .then(({ data: { rooms } }) => {
        if (!isUnmounted.current) {
          setRooms(rooms);
        }
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          // toast.error(err.response.data.error.msg);
        }
      })
      .finally(() => {
        if (!isUnmounted.current) {
          setFetching(false);
        }
      });
  };

  const createRoom = useCallback(() => {
    Axios.post('/api/user/chats/rooms', { toAccount: to })
      .then(() => {
        if (!isUnmounted.current) {
          setCreated(true);
          fetchRooms();
        }
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      });
  }, [to]);

  useEffect(() => {
    fetchRooms();

    return () => {
      isUnmounted.current = true;
    };
  }, []);

  useEffect(() => {
    if (isCreated) {
      createRoom();
    }
  }, [isCreated, createRoom]);

  if (to && listRoom.length > 0) {
    let foundId = null;
    for (let i = 0; i < listRoom.length; i += 1) {
      const { accounts } = listRoom[i];
      for (let j = 0; j < accounts.length; j += 1) {
        if (to === accounts[j]._id) {
          foundId = listRoom[i]._id;
          break;
        }
      }
      if (foundId) {
        break;
      }
    }
    if (foundId) {
      return <Redirect to={`/account/messages/?room=${foundId}`} />;
    }

    // nếu không có -> tạo 1 room ở server
    if (!isCreated) {
      setCreated(true);
    }
  }

  if (to && !isFetching && listRoom.length === 0) {
    // nếu không có -> tạo 1 room ở server
    if (!isCreated) {
      setCreated(true);
    }
  }

  if (!roomId && !to && listRoom.length > 0) {
    return <Redirect to={`/account/messages/?room=${listRoom[0]._id}`} />;
  }

  return (
    <div>
      <ListGroup className='chat-list' variant='flush'>
        {!isFetching &&
          listRoom &&
          listRoom.map(room => {
            return (
              <Fade key={room._id}>
                <ListGroup.Item className='chat-item'>
                  <Link
                    className={`user rounded no-effect ${
                      roomId === room._id ? 'selected-chat' : ''
                    }`}
                    // activeClassName='selected-chat'
                    to={`/account/messages/?room=${room._id}`}
                    replace
                  >
                    <Image
                      src={room.avatar ? room.avatar : avatarDefault}
                      width={35}
                      height={35}
                      roundedCircle
                    />
                    <div className='right-block d-none d-lg-block'>
                      <p className='user-name'>{room.name}</p>
                      {/* <p className='msg-text'>hello</p> */}
                    </div>
                  </Link>
                </ListGroup.Item>
              </Fade>
            );
          })}
        {isFetching &&
          skeleton.map(() => <Skeleton key={shortid.generate()} height={50} />)}
      </ListGroup>
    </div>
  );
};

export default ChatList;
