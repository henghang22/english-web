import api from './auth.api';

export const courseApi = {
  getAll: () => api.get('/courses'),
  getMyCourses: () => api.get('/courses/my-courses'),
  getDetail: (id) => api.get(`/courses/${id}`),
  getLesson: (id) => api.get(`/courses/lessons/${id}`)
};
