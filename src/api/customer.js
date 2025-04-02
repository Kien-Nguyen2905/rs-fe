import api from '@/api/api';
export const customer = {
  async getCustomerList(params = {}) {
    const response = await api.get('/customer/list', {
      params,
    });
    return response.data;
  },
  async getCustomerById(id) {
    const response = await api.get(`/customer/${id}`);
    return response.data;
  },
  async createCustomer(data) {
    const response = await api.post('/customer', data);
    return response.data;
  },

  async updateCustomer(id, data) {
    const response = await api.put(`/customer/${id}`, data);
    return response.data;
  },
  async createRequest(data) {
    const response = await api.post('/customer/request', data);
    return response.data;
  },
};
