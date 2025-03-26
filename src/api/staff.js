import api from '@/api/api';

export const staff = {
  async getStaffList() {
    const response = await api.get('/staff/list');
    return response.data;
  },
  async getStaffDetail(id) {
    const response = await api.get(`/staff/detail/${id}`);
    return response.data;
  },
  async createStaff(data) {
    const response = await api.post('/staff/create', data);
    return response.data;
  },
  async updateStaff(id, data) {
    const response = await api.put(`/staff/update/${id}`, data);
    return response.data;
  },
};
