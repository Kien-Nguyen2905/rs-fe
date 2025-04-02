import { estate } from '@/api/estate';
import { useQuery } from '@tanstack/react-query';

export const useTypeEstateQuery = () => {
  return useQuery({
    queryKey: ['estateTypeList'],
    queryFn: () => estate.getType(),
  });
};

export const useEstateQuery = () => {
  return useQuery({
    queryKey: ['estateList'],
    queryFn: () => estate.getEstate(),
  });
};
