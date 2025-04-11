import api from './api';

export const transfer = {
  async getTransferList() {
    const response = await api.get('/transfer-contract/list');
    return response.data;
  },
  async getTransferById(id) {
    const response = await api.get(`/transfer-contract/${id}`);
    return response.data;
  },
  async create(data) {
    const response = await api.post('/transfer-contract', data);
    return response.data;
  },
  async delete(id) {
    const response = await api.delete(`/transfer-contract/${id}`);
    return response.data;
  },
};
