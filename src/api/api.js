import axios from 'axios';

const BASE_URL_LOCAL = 'http://localhost:3030';
const BASE_URL_PRODUCTION = 'https://server-annguyen.site';

const api = axios.create({
  baseURL:
    import.meta.env.MODE === 'production'
      ? BASE_URL_PRODUCTION
      : BASE_URL_LOCAL,
  withCredentials: true, // Ensures cookies are sent with requests
});

// Add a request interceptor to enforce credentials in all requests
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
