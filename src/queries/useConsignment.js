import { consignment } from '@/api/consignment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useConsignmentListQuery = () => {
  return useQuery({
    queryKey: ['consignmentList'],
    queryFn: () => consignment.getConsignmentList(),
  });
};

export const useConsignmentByIdQuery = (id) => {
  return useQuery({
    queryKey: ['consignmentById', id],
    queryFn: () => consignment.getConsignmentById(id),
  });
};

export const useCreateConsignmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => consignment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['consignmentList'],
      });
    },
  });
};

export const useUpdateConsignmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => consignment.update(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['consignmentList'],
      });
    },
  });
};

export const useDeleteConsignmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => consignment.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['consignmentList'],
      });
    },
  });
};
