import { estate } from '@/api/estate';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export const useEstateByIdQuery = (id) => {
  return useQuery({
    queryKey: ['estateById', id],
    queryFn: () => estate.getEstateById(id),
    enabled: !!id,
  });
};

export const useCreateEstateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: estate.createEstate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['estateList'],
      });
    },
  });
};

export const useUpdateEstateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ([id, data]) => estate.updateEstate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['estateList'],
      });
    },
  });
};
