import React, { useEffect, useState } from 'react';
import '../../../assets/scss/Chat.scss';
import _ from 'lodash';
import shortid from 'shortid';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import ChatList from '../../../components/chat/ChatList';
import ChatBox from '../../../components/chat/ChatBox';
import { instance as socket, connect } from '../../../socket/SocketManager';
import { RCV_MESSAGE } from '../../../socket/socketConst';
import TokenStorage from '../../../utils/TokenStorage';
import { toast } from '../../../components/widgets/toast';

const Message = () => {
  const { toUserId } = useParams();
  const account = TokenStorage.decode();
  const [messages, setMessages] = useState([]);
  const [isFetching, setFetching] = useState(false);
  useEffect(() => {
    connect();
  }, []);
  useEffect(() => {
    setFetching(true);
    Axios.get(`/api/user/chats?to=${toUserId}`)
      .then(({ data: { chats: list } }) => {
        setMessages(list);
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }, [toUserId]);
  useEffect(() => {
    socket.on(RCV_MESSAGE, data => {
      const temp = [...messages];
      temp.push(data);
      setMessages(temp);
    });
  }, [messages]);

  const sendMessage = data => {
    const temp = [...messages];
    temp.push(data);
    setMessages(temp);
  };
  return (
    <div className='chat-wrapper' style={{ height: window.innerHeight - 100 }}>
      <div className='scroll active-chats border-right'>
        <ChatList />
      </div>
      <div className='chat-messages'>
        <div className='messages scroll'>
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
        </div>
        <div className='chat-box'>
          <ChatBox onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Message;
