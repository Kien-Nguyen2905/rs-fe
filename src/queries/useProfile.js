import { profile } from '@/api/profile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useMeQuery = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: profile.me,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profile.update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['me'],
      });
    },
  });
};

export const useChangePasswordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profile.changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['me'],
      });
    },
  });
};
