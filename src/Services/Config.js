import axios from 'axios';
import store from '../Redux/store';

const BASE_URL = `https://mychirpbyte.com/api`;
const expiredToken = '303|laravel_sanctum_CnNXNUOfETte1xrQdnHonkpoWEmsrZW7UY7OWglH9f332cca';
const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header
client.interceptors.request.use(
  async config => {
    const requestConfig = config;
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      // console.log("TOKEN requestConfig ==>",JSON.stringify(requestConfig?.data));
      // console.log("TOKEN requestConfig ==>",`${requestConfig.baseURL}/${requestConfig.url}`);
      requestConfig.headers.Authorization = `Bearer ${token}`;
      // console.log("TOKEN ==>",token);
    }
    return requestConfig;
  },
  err => {
    console.log('Request error:', err);
    return Promise.reject(err);
  },
);

// Response interceptor to handle 401 errors
client.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized (401):', error.response.data);
    }
    return Promise.reject(error);
  },
);

export { client };
