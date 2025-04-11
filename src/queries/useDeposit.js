import { deposit } from '@/api/deposit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useDepositListQuery = () => {
  return useQuery({
    queryKey: ['depositList'],
    queryFn: () => deposit.getDepositList(),
  });
};

export const useDepositByIdQuery = (id) => {
  return useQuery({
    queryKey: ['depositById', id],
    queryFn: () => deposit.getDepositById(id),
    enabled: !!id,
  });
};

export const useCreateDepositMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => deposit.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depositList'] });
      queryClient.invalidateQueries({ queryKey: ['depositById'] });
    },
  });
};

export const useCancelDepositMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deposit.update(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['depositList'] });
      queryClient.invalidateQueries({ queryKey: ['depositById', id] });
    },
  });
};
export const useDeleteDepositMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deposit.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['depositList'] });
      queryClient.invalidateQueries({ queryKey: ['depositById', id] });
    },
  });
};
