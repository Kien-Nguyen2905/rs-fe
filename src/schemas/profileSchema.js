import { AuthMess } from '@/constants/message';
import { z } from 'zod';
import { staffSchemaBase } from './staffSchema';

export const updateMeSchema = staffSchemaBase
  .extend({
    matkhau: staffSchemaBase.shape.matkhau.optional().or(z.literal('')),
  })
  .omit({
    quyen: true,
    trangthai: true,
  });

// [Admin] Cập nhật thông tin nhân viên
export const updateAdminSchema = staffSchemaBase.extend({
  matkhau: staffSchemaBase.shape.matkhau.optional().or(z.literal('')),
});
// Đổi mật khẩu
export const changePasswordSchema = z.object({
  matkhaucu: z.string().min(6, AuthMess.PASSWORD_INVALID),
  matkhaumoi: z.string().min(6, AuthMess.PASSWORD_INVALID),
});
