import axios from 'axios';
import TokenStorage from '../utils/TokenStorage';

// interceptor to stick Authentication
axios.interceptors.request.use(
  request => {
    request.headers['Content-Type'] = 'application/json';
    request.baseURL = 'http://localhost:5000';
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
