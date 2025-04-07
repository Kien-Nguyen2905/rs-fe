import { z } from 'zod';
import { CustomerMess } from '@/constants/message';
import { RealEstateMess } from '@/constants/message';
import { ContractMess } from '@/constants/message';

export const depositContractSchema = z
  .object({
    khid: z.coerce.number().min(1, CustomerMess.ID_NOT_EXITS),

    bdsid: z.coerce.number().min(1, RealEstateMess.ID_NOT_EXIST),

    giatri: z.coerce.number().min(1, ContractMess.VALUE_INVALID),

    ngayhethan: z
      .string()
      .refine((val) => {
        const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(val);
        if (!isValidFormat) return false;

        const date = new Date(val);
        return !isNaN(date.getTime());
      }, ContractMess.DATE_INVALID)
      .refine((val) => {
        const ngay = new Date(val);
        const today = new Date();

        ngay.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        return ngay > today;
      }, ContractMess.DATE_INVALID),
  })
  .strict();
