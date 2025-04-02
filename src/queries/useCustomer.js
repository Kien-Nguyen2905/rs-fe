import { customer } from '@/api/customer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useCustomerListQuery = (params = {}) => {
  return useQuery({
    queryKey: ['customerList', params],
    queryFn: () => customer.getCustomerList(params),
  });
};

export const useGetCustomerByIdQuery = (id) => {
  return useQuery({
    queryKey: ['customerById', id],
    queryFn: () => customer.getCustomerById(id),
  });
};

export const useCreateCustomerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customer.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customerList'],
      });
    },
  });
};

export const useUpdateCustomerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => customer.updateCustomer(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customerList'],
        exact: true,
      });
    },
  });
};
export const useCreateRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customer.createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customerList'],
        exact: true,
      });
    },
  });
};
