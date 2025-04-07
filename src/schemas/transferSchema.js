import { ContractMess } from '@/constants/message';
import { z } from 'zod';

export const transferContractSchema = z
  .object({
    dcid: z.coerce.number().min(1, ContractMess.ID_NOT_EXIT),

    giatri: z.coerce.number().min(1, ContractMess.VALUE_INVALID),
  })
  .strict();
