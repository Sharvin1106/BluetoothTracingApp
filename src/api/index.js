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
  return response.data;
};

export const createUser = async data => {
  const response = await apiV1.post('/createUser', data);
  return response.data;
};

export const getUser = async data => {
  const response = await apiV1.get(`/getUser/${data}`);
  return response.data;
};

export const uploadDetails = async data => {
  const response = await apiV1.post('uploadContactDetails', data);
  return response.data;
};

export const getCentrality = async data => {
  const response = await apiV1.post('/getCentrality', data);
  return response.data;
}
