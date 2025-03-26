import axios from 'axios';

const BASE_URL_LOCAL = 'http://localhost:3030';
const BASE_URL_PRODUCTION = 'http://103.155.161.81:3030';

const api = axios.create({
  baseURL:
    import.meta.env.MODE === 'production'
      ? BASE_URL_PRODUCTION
      : BASE_URL_LOCAL,
  withCredentials: true, // send cookies in every request
});

export default api;
