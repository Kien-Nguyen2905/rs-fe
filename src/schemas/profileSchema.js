import { z } from 'zod';
export const updateAdminSchema = z.object({
  taikhoan: z.string().min(1, 'Tài khoản không được để trống'),
  tennv: z.string().min(1, 'Tên nhân viên không được để trống'),
  sdt: z.string().regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ'),
  diachi: z.string().min(1, 'Địa chỉ không được để trống'),
  ngaysinh: z.string().date('Ngày sinh không hợp lệ'),
  gioitinh: z.number().refine((val) => val === 0 || val === 1, {
    message: 'Giới tính không hợp lệ',
  }),
  email: z.string().email('Email không hợp lệ'),
  quyen: z.number().refine((val) => val === 0 || val === 1, {
    message: 'Quyền không hợp lệ',
  }),
  trangthai: z
    .number()
    .optional()
    .refine((val) => val === undefined || val === 0 || val === 1, {
      message: 'Trạng thái không hợp lệ',
    }),
});

export const updateMeSchema = z.object({
  taikhoan: z.string().min(1, 'Tài khoản không được để trống'),
  tennv: z.string().min(1, 'Tên nhân viên không được để trống'),
  sdt: z.string().regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ'),
  diachi: z.string().min(1, 'Địa chỉ không được để trống'),
  ngaysinh: z.string().date('Ngày sinh không hợp lệ'),
  gioitinh: z.number().refine((val) => val === 0 || val === 1, {
    message: 'Giới tính không hợp lệ',
  }),
  email: z.string().email('Email không hợp lệ'),
});

export const changePasswordSchema = z.object({
  matkhaucu: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  matkhaumoi: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});
