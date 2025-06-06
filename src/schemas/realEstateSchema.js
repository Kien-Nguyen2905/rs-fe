import { CustomerMess, RealEstateMess } from '@/constants/message';
import { z } from 'zod';

export const realEstateSchemaBase = z.object({
  loaiid: z.coerce.number().min(1, RealEstateMess.IDTYPE_INVALID),
  khid: z.coerce.number().min(1, CustomerMess.ID_REQUIRED),
  tinhtrang: z.coerce.number().min(0, RealEstateMess.STATUS_INVALID).optional(),
  hinhanh: z
    .union([
      z
        .instanceof(File, { message: 'Nhập hình ảnh' })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: 'Kích thước file tối đa là 5MB',
        })
        .refine(
          (file) =>
            ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
          {
            message: 'Chỉ chấp nhận định dạng JPEG, PNG hoặc WEBP',
          },
        ),
      z.string().url({ message: 'URL hình ảnh không hợp lệ' }),
    ])
    .optional(),
  dientich: z.coerce.number().min(1, RealEstateMess.SIZE_INVALID),
  dongia: z.coerce.number().min(1, RealEstateMess.SIZE_INVALID),
  masoqsdd: z.string().min(1, RealEstateMess.ASSET_CODE),
  mota: z.string().optional(),
  chieudai: z.coerce.number().min(1, RealEstateMess.SIZE_INVALID),
  chieurong: z.coerce.number().min(1, RealEstateMess.SIZE_INVALID),
  huehong: z.coerce.number().min(1, RealEstateMess.ROSES_INVALID),
  tenduong: z.string().min(1, RealEstateMess.ADDRESS_REQUIRED),
  thanhpho: z.string().min(1, RealEstateMess.ADDRESS_REQUIRED),
  sonha: z.string().min(1, RealEstateMess.ADDRESS_REQUIRED),
  quan: z.string().min(1, RealEstateMess.ADDRESS_REQUIRED),
  phuong: z.string().min(1, RealEstateMess.ADDRESS_REQUIRED),
});
