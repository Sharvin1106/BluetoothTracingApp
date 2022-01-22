import axios from 'axios';

const apiV1 = axios.create({
  baseURL: 'https://jom-trace-backend.herokuapp.com',
  headers: {'Content-Type': 'application/json'},
});

apiV1.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.message === 'Network Error') return null;

    return Promise.reject(error);
  },
);

export const getAllLocations = async () => {
  const response = await apiV1.get('/getLocations');
  return response;
};
