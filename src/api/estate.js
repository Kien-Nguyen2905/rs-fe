import api from './api';

export const estate = {
  async getType() {
    const response = await api.get('/type-real-estate/list');
    return response.data;
  },
};
