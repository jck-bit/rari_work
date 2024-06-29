import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rari-express.vercel.app',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setUnauthorizedCallback = (logoutCallback: () => void) => {
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        logoutCallback();
      }
      return Promise.reject(error);
    }
  );
};

export default api;




