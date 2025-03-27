import { z } from 'zod';
export const loginSchema = z.object({
  taikhoan: z.string().min(1, 'Tài khoản không được để trống'),
  matkhau: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});
