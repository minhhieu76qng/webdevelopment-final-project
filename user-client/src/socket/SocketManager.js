import io from 'socket.io-client';
import { SEND_MESSAGE, NEW_USER } from './socketConst';
import TokenStorage from '../utils/TokenStorage';

const { REACT_APP_BASE_URL } = process.env;
const socket = io(REACT_APP_BASE_URL);

export const instance = socket;

export function connect() {
  const account = TokenStorage.decode();
  if (account && account._id) {
    socket.emit(NEW_USER, account._id, () => {});
  }
}

export function sendMessage({ roomId, msg }, callback) {
  const account = TokenStorage.decode();
  if (account && account._id) {
    const current = new Date();
    socket.emit(SEND_MESSAGE, { roomId, msg, date: current }, callback);
  }
}
