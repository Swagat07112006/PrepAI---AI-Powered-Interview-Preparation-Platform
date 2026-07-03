import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('prepai_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error.message || 'Something went wrong';
    error.message = message;
    return Promise.reject(error);
  },
);

async function request(method, url, data, params) {
  const response = await api.request({ method, url, data, params });
  return response.data;
}

export const authApi = {
  login: (payload) => request('post', '/auth/login', payload),
  register: (payload) => request('post', '/auth/register', payload),
  me: () => request('get', '/auth/me'),
  logout: () => request('post', '/auth/logout'),
};

export const dashboardApi = {
  get: () => request('get', '/dashboard'),
};

export const questionsApi = {
  list: (params) => request('get', '/questions', undefined, params),
  get: (id) => request('get', `/questions/${id}`),
  create: (payload) => request('post', '/questions', payload),
  update: (id, payload) => request('put', `/questions/${id}`, payload),
  remove: (id) => request('delete', `/questions/${id}`),
};

export const notesApi = {
  list: (params) => request('get', '/notes', undefined, params),
  get: (id) => request('get', `/notes/${id}`),
  create: (payload) => request('post', '/notes', payload),
  update: (id, payload) => request('put', `/notes/${id}`, payload),
  remove: (id) => request('delete', `/notes/${id}`),
};

export const revisionsApi = {
  due: () => request('get', '/revisions/due'),
  upcoming: () => request('get', '/revisions/upcoming'),
  completed: () => request('get', '/revisions/completed'),
};