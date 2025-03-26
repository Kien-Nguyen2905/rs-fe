import { auth } from '@/api/auth';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: auth.login,
  });
};

export const useMeQuery = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: auth.me,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: auth.logout,
  });
};
