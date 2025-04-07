import api from './api';

export const deposit = {
  async getDepositList() {
    const response = await api.get('/deposit-contract/list');
    return response.data;
  },
  async getDepositById(id) {
    const response = await api.get(`/deposit-contract/${id}`);
    return response.data;
  },
  async create(data) {
    const response = await api.post('/deposit-contract', data);
    return response.data;
  },
  async update(id) {
    const response = await api.put(`/deposit-contract/cancel/${id}`);
    return response.data;
  },
};
