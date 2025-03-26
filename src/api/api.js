import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3030',
  withCredentials: true, // send cookies in every request
});

export default api;
