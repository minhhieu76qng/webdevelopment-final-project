import Axios from 'axios';
import TokenStorage from '../utils/TokenStorage';

export const SET_USER = 'SET_USER';
export const SET_CITIES = 'SET_CITIES';
export const SET_CATEGORIES = 'SET_CATEGORIES';

export function setUser(account) {
  return { type: SET_USER, account };
}

export function setCities(list) {
  return { type: SET_CITIES, list };
}

export function setCategories(list) {
  return { type: SET_CATEGORIES, list };
}

export function fetchCategories() {
  return dispatch => {
    return Axios.get('/api/categories')
      .then(({ data: { categories } }) => {
        dispatch(setCategories(categories));
      })
      .catch(err => {});
  };
}

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

export function fetchCities() {
  return dispatch => {
    return Axios.get('/api/cities')
      .then(({ data: { cities: list } }) => {
        console.log(list);
        dispatch(setCities(list));
      })
      .catch(err => {});
  };
}
