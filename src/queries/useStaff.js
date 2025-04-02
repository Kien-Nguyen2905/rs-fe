import { staff } from '@/api/staff';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useStaffListQuery = (params = {}) => {
  return useQuery({
    queryKey: ['staffList', params],
    queryFn: () => staff.getStaffList(params),
  });
};

export const useStaffDetailQuery = (id) => {
  return useQuery({
    queryKey: ['staffDetail', id],
    queryFn: () => staff.getStaffDetail(id),
    enabled: !!id, // Only run the query if id is provided
  });
};

export const useCreateStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: staff.createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['staffList'],
      });
    },
  });
};

export const useUpdateStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => staff.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['staffList'],
      });
    },
  });
};
