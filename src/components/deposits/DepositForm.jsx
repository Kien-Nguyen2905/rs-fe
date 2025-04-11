import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { depositContractSchema } from '@/schemas/depositSchema'; // Use deposit schema
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateDepositMutation } from '@/queries/useDeposit'; // Use deposit mutation
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'react-toastify';
import { handleError } from '@/utils/utils';

export const DepositForm = ({ open, onOpenChange, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createDepositMutation = useCreateDepositMutation(); // Use deposit mutation hook

  const form = useForm({
    resolver: zodResolver(depositContractSchema), // Use deposit schema resolver
    defaultValues: {
      khid: '',
      bdsid: '',
      giatri: '',
      ngayhethan: '', // Changed from ngayketthuc
      // Removed chiphidv, ngaybatdau, trangthai as they are not in deposit schema
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createDepositMutation.mutateAsync(data);
      toast.success('Hợp đồng cọc đã được tạo thành công');
      form.reset();
      onClose();
    } catch (error) {
      handleError({ error: error, setError: form.setError });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo hợp đồng đặt cọc</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="py-2 space-y-4"
          >
            <FormField
              control={form.control}
              name="khid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã khách hàng</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập mã khách hàng"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? '' : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bdsid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã bất động sản</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập mã bất động sản"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? '' : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="giatri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá trị đặt cọc</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập giá trị cọc"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? '' : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ngayhethan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày hết hạn</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Hủy bỏ
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang tạo...' : 'Tạo hợp đồng'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
