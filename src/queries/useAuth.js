import { auth } from '@/api/auth';
import { useMutation } from '@tanstack/react-query';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: auth.login,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: auth.logout,
  });
};
