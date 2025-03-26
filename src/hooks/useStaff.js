import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useStaffList() {
  return useQuery({
    queryKey: ['staff', 'list'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/staff/list`);
      return response.data;
    },
  });
}

export function useStaffDetail(id) {
  return useQuery({
    queryKey: ['staff', 'detail', id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/staff/detail/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
