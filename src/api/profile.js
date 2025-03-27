import api from './api';

export const profile = {
  async me() {
    const response = await api.get('/me');
    return response.data;
  },
  async update(data) {
    const response = await api.put('/me', data);
    return response.data;
  },
  async changePassword(data) {
    const response = await api.put('/change-pass', data);
    return response.data;
  },
};
