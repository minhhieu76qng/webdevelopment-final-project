import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import shortid from 'shortid';
import Axios from 'axios';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import '../../../assets/scss/Chat.scss';
import ChatList from '../../../components/chat/ChatList';
import ChatBox from '../../../components/chat/ChatBox';
import { instance as socket, connect } from '../../../socket/SocketManager';
import { RCV_MESSAGE } from '../../../socket/socketConst';
import TokenStorage from '../../../utils/TokenStorage';
import { toast } from '../../../components/widgets/toast';

const Message = () => {
  const { room } = queryString.parse(useLocation().search);
  const account = TokenStorage.decode();
  const [messages, setMessages] = useState([]);
  const [isFetching, setFetching] = useState(false);

  const scrollBottom = () => {
    const el = document.querySelector(
      '#messages-scroll .simplebar-content-wrapper',
    );
    el.scrollTo({
      top: el.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (room) {
      setFetching(true);
      Axios.get(`/api/user/chats/rooms/${room}/messages`)
        .then(({ data: { messages: list } }) => {
          setMessages(list);
          setTimeout(() => {
            scrollBottom();
          }, 100);
        })
        .catch(err => {
          if (err && err.response && err.response.data.error) {
            toast.error(err.response.data.error.msg);
          }
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [room]);

  useEffect(() => {
    socket.on(RCV_MESSAGE, data => {
      const temp = [...messages];
      temp.push(data);
      setMessages(temp);
      scrollBottom();
    });
  }, [messages]);

  const sendMessage = data => {
    const temp = [...messages];
    temp.push(data);
    setMessages(temp);
    scrollBottom();
  };

  return (
    <div className='chat-wrapper' style={{ height: window.innerHeight - 100 }}>
      <div className='scroll active-chats border-right'>
        <ChatList />
      </div>
      <div className='chat-messages'>
        <div className='messages' style={{ overflowY: 'hidden' }}>
          <SimpleBarReact
            id='messages-scroll'
            style={{ maxHeight: '100%', paddingRight: 15 }}
          >
            {isFetching && <div>loading</div>}
            {!isFetching && (
              <ul className='list'>
                {messages &&
                  _.isArray(messages) &&
                  messages.map(m => {
                    let isMe = false;
                    if (m.from === account._id) {
                      isMe = true;
                    }
                    return (
                      <li
                        key={shortid.generate()}
                        className={`${isMe ? 'me' : ''}`}
                      >
                        <div className='msg rounded'>{m.msg}</div>
                      </li>
                    );
                  })}
              </ul>
            )}
          </SimpleBarReact>
        </div>
        <div className='chat-box'>
          <ChatBox onSend={sendMessage} roomId={room} />
        </div>
      </div>
    </div>
  );
};

export default Message;
