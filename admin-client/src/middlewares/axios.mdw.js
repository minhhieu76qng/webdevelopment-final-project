import axios from 'axios';
import TokenStorage from '../utils/TokenStorage';

// interceptor to stick Authentication
axios.interceptors.request.use(
  request => {
    const { REACT_APP_BASE_URL } = process.env;
    request.headers['Content-Type'] = 'application/json';
    request.baseURL = REACT_APP_BASE_URL;
    if (TokenStorage.isValid()) {
      const token = `Bearer ${TokenStorage.get()}`;
      request.headers.Authorization = token;
    }
    return request;
  },
  error => {
    return Promise.reject(error);
  },
);
