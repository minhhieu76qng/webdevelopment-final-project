import Axios from 'axios';
import TokenStorage from '../utils/TokenStorage';

export const SET_USER = 'SET_USER';
export const SET_CITIES = 'SET_CITIES';
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const SET_TAGS = 'SET_TAGS';

export function setUser(account) {
  return { type: SET_USER, account };
}

export function setCities(list) {
  return { type: SET_CITIES, list };
}

export function setTags(list) {
  return { type: SET_TAGS, list };
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
      .catch(() => {});
  };
}

export function fetchAccount() {
  return dispatch => {
    const accountInToken = TokenStorage.decode();
    if (!accountInToken) {
      dispatch(setUser(null));
      return 0;
    }
    return Axios.get(`/api/user/accounts/me`)
      .then(({ data: { account } }) => {
        dispatch(setUser(account));
      })
      .catch(() => {});
  };
}

export function fetchCities() {
  return dispatch => {
    return Axios.get('/api/cities')
      .then(({ data: { cities: list } }) => {
        dispatch(setCities(list));
      })
      .catch(() => {});
  };
}

export function fetchTags() {
  return dispatch => {
    return Axios.get('/api/tags')
      .then(({ data: { tags } }) => {
        dispatch(setTags(tags));
      })
      .catch(() => {});
  };
}
