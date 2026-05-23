import api from './auth.api';

const API_URL = '/progress';

export const progressApi = {
  updateProgress: (lessonId, isCompleted) => 
    api.post(`${API_URL}/lessons/${lessonId}`, { isCompleted }),
  
  getProgress: (courseId) => 
    api.get(`${API_URL}/courses/${courseId}`),
  
  getResumeInfo: (courseId) => 
    api.get(`${API_URL}/courses/${courseId}/resume`)
};
