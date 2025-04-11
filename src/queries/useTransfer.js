import { transfer } from '@/api/transfer';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useTransferListQuery = () => {
  return useQuery({
    queryKey: ['transferList'],
    queryFn: () => transfer.getTransferList(),
  });
};

export const useTransferByIdQuery = (id) => {
  return useQuery({
    queryKey: ['transferById', id],
    queryFn: () => transfer.getTransferById(id),
    enabled: !!id,
  });
};

export const useCreateTransferMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => transfer.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transferList'] });
      queryClient.invalidateQueries({ queryKey: ['transferById'] });
    },
  });
};

export const useDeleteTransferMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => transfer.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['transferList'] });
      queryClient.invalidateQueries({ queryKey: ['transferById', id] });
    },
  });
};
