import api from '@/api/api';

export const staff = {
  async getStaffList(params = {}) {
    const response = await api.get('/staff/list', {
      params,
    });
    return response.data;
  },
  async getStaffDetail(id) {
    const response = await api.get(`/staff/${id}`);
    return response.data;
  },
  async createStaff(data) {
    const response = await api.post('/staff', data);
    return response.data;
  },
  async updateStaff(id, data) {
    const response = await api.put(`/staff/${id}`, data);
    return response.data;
  },
};
