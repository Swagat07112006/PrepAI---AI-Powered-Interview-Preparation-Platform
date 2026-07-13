import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
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
  updateProfile: (payload) => request('put', '/auth/profile', payload),
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
  byQuestion: (questionId) => request('get', `/revisions/question/${questionId}`),
  complete: (id) => request('put', `/revisions/${id}/complete`),
  skip: (id) => request('put', `/revisions/${id}/skip`),
  reschedule: (id, payload) => request('put', `/revisions/${id}/reschedule`, payload),
  markMissed: (id) => request('put', `/revisions/${id}/missed`),
};

export const aiApi = {
  roadmap: (payload) => request('post', '/ai/roadmap', payload),
  roadmapHistory: () => request('get', '/ai/roadmap/history'),
  deleteRoadmap: (id) => request('delete', `/ai/roadmap/${id}`),
  explain: (payload) => request('post', '/ai/explain', payload),
  explainHistory: () => request('get', '/ai/explain/history'),
  deleteExplain: (id) => request('delete', `/ai/explain/${id}`),



  resumeReview: (formData) => {
    // Requires multipart/form-data for uploads
    return api.post('/ai/resume-review', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },
  resumeHistory: () => request('get', '/ai/resume/history'),
  deleteResume: (id) => request('delete', `/ai/resume/${id}`),
  startMock: (payload) => request('post', '/ai/mock/start', payload),
  evaluateAnswer: (payload) => request('post', '/ai/mock/evaluate', payload),
  mockHistory: () => request('get', '/ai/mock/history'),
  deleteMock: (id) => request('delete', `/ai/mock/${id}`),
  dashboard: () => request('get', '/ai-dashboard'),
};


