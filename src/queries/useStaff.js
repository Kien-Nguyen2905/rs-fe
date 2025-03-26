import { staff } from '@/api/staff';
import { useQuery, useMutation } from '@tanstack/react-query';

export const useStaffListQuery = () => {
  return useQuery({
    queryKey: ['staffList'],
    queryFn: staff.getStaffList,
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
  return useMutation({
    mutationFn: staff.createStaff,
  });
};

export const useUpdateStaffMutation = () => {
  return useMutation({
    mutationFn: ({ id, data }) => staff.updateStaff(id, data),
  });
};
