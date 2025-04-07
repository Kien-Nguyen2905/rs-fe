import api from './api';

export const consignment = {
  async getConsignmentList() {
    const response = await api.get('/consignment-contract/list');
    return response.data;
  },
  async getConsignmentById(id) {
    const response = await api.get(`/consignment-contract/${id}`);
    return response.data;
  },
  async create(data) {
    const response = await api.post('/consignment-contract', data);
    return response.data;
  },
  async update(id) {
    const response = await api.put(`/consignment-contract/cancel/${id}`);
    return response.data;
  },
};
