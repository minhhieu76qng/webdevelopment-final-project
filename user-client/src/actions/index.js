import Axios from 'axios';
import TokenStorage from '../utils/TokenStorage';

export const SET_USER = 'SET_USER';

export function setUser(account) {
  return { type: SET_USER, account };
}

export function fetchMenu() {}

export function fetchAccount() {
  const account = TokenStorage.decode();
  if (!account) {
    // to login
  }
  return dispatch => {
    return Axios.get(`/api/user/accounts/me`)
      .then(({ data: { account } }) => {
        dispatch(setUser(account));
      })
      .catch(err => {});
  };
}
