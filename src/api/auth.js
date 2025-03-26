import api from '@/api/api';
export const auth = {
  async login(data) {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  async me() {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};
