import { CustomerMess, RealEstateMess } from '@/constants/message';
import { z } from 'zod';

export const customerSchemaBase = z.object({
  hoten: z.string().min(1, CustomerMess.NAME_REQUIRED),
  diachi: z.string().min(1, CustomerMess.ADDRESS_REQUIRED),
  diachitt: z.string().min(1, CustomerMess.ADDRESS_REQUIRED),
  cmnd: z.string().length(12, CustomerMess.CMND_INVALID),
  ngaysinh: z.string().date(CustomerMess.BIRTHDAY_INVALID),
  sdt: z.string().regex(/^0\d{9}$/, CustomerMess.PHONENUMBER_INVALID),
  gioitinh: z.number().refine((val) => val === 0 || val === 1, {
    message: CustomerMess.SEX_REQUIRED,
  }),
  email: z.string().email(CustomerMess.EMAIL_INVALID),
  loaikh: z
    .number()
    .optional()
    .refine((val) => val === undefined || val === 0 || val === 1, {
      message: CustomerMess.TYPE_INVALID,
    }),
  trangthai: z
    .number()
    .optional()
    .refine((val) => val === undefined || val === 0 || val === 1, {
      message: CustomerMess.STATUS_INVALID,
    }),
});

export const requestCustomerSchema = z.object({
  loaiid: z.number().min(1, RealEstateMess.IDTYPE_INVALID),
  khid: z.number().min(1, CustomerMess.IDSTAFF_REQUIRED),
  vitri: z.string().min(1, RealEstateMess.ADDRESS_REQUIRED),
  giaf: z.number().min(1, RealEstateMess.PRICE_INVALID),
  giat: z.number().min(1, RealEstateMess.PRICE_INVALID),
  daif: z.number().min(1, RealEstateMess.SIZE_INVALID),
  dait: z.number().min(1, RealEstateMess.SIZE_INVALID),
  rongf: z.number().min(1, RealEstateMess.SIZE_INVALID),
  rongt: z.number().min(1, RealEstateMess.SIZE_INVALID),
});
