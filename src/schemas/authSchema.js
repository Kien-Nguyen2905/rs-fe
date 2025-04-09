import { AuthMess } from '@/constants/message';
import { z } from 'zod';
export const loginSchema = z.object({
  taikhoan: z.string().min(1, AuthMess.ACCOUNT_REQUIRED),
  matkhau: z.string().min(6, AuthMess.PASSWORD_INVALID),
});
