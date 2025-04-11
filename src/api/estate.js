import api from './api';

export const estate = {
  async getType() {
    const response = await api.get('/type-real-estate/list');
    return response.data;
  },
  async getEstate() {
    const response = await api.get('/real-estate/list');
    return response.data;
  },
  async getEstateById(id) {
    const response = await api.get(`/real-estate/${id}`);
    return response.data;
  },
  async createEstate(data) {
    const response = await api.post('/real-estate', data);
    return response.data;
  },
  async deleteEstate(id) {
    const response = await api.delete(`/real-estate/${id}`);
    return response.data;
  },
  async updateEstate(id, data) {
    const response = await api.put(`/real-estate/${id}`, data);
    return response.data;
  },
};
