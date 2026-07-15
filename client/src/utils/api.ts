import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically inject JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ybm_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const apiService = {
  // Authentication
  async login(credentials: { username: string; password: string }) {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async registerAdmin(data: { username: string; password: string }) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  // Projects CRUD
  async getProjects() {
    const res = await api.get('/projects');
    return res.data;
  },

  async getProject(id: string) {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },

  async createProject(projectData: any) {
    const res = await api.post('/projects', projectData);
    return res.data;
  },

  async updateProject(id: string, projectData: any) {
    const res = await api.put(`/projects/${id}`, projectData);
    return res.data;
  },

  async deleteProject(id: string) {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },

  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  // Testimonials CRUD
  async getTestimonials() {
    const res = await api.get('/testimonials');
    return res.data;
  },

  async createTestimonial(data: any) {
    const res = await api.post('/testimonials', data);
    return res.data;
  },

  async deleteTestimonial(id: string) {
    const res = await api.delete(`/testimonials/${id}`);
    return res.data;
  },

  // Services
  async getServices() {
    const res = await api.get('/services');
    return res.data;
  },

  async updateService(id: string, data: any) {
    const res = await api.put(`/services/${id}`, data);
    return res.data;
  },

  // Submissions (Leads)
  async submitInquiry(data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message?: string;
    type: 'contact' | 'quote';
    details?: any;
  }) {
    const res = await api.post('/submissions', data);
    return res.data;
  },

  async getSubmissions() {
    const res = await api.get('/submissions');
    return res.data;
  },

  async updateSubmissionStatus(id: string, status: 'unread' | 'in-progress' | 'replied') {
    const res = await api.put(`/submissions/${id}/status`, { status });
    return res.data;
  },

  // Site Settings & SEO
  async getSettings() {
    const res = await api.get('/settings');
    return res.data;
  },

  async updateSettings(data: any) {
    const res = await api.put('/settings', data);
    return res.data;
  },

  // Analytics Reports
  async getAnalytics() {
    const res = await api.get('/analytics');
    return res.data;
  }
};

export default api;
