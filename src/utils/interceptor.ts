import api from '../api';

let isSetup = false;

const setupInterceptors = (logoutCallback: () => void) => {
  if (isSetup) return;
  isSetup = true;

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

export default setupInterceptors;
