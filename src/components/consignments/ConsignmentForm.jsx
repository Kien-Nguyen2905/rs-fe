import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { csmContractSchema } from '@/schemas/consignmentSchema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateConsignmentMutation } from '@/queries/useConsignment';
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

export const ConsignmentForm = ({ open, onOpenChange, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createConsignmentMutation = useCreateConsignmentMutation();

  const form = useForm({
    resolver: zodResolver(csmContractSchema),
    defaultValues: {
      khid: '',
      bdsid: '',
      giatri: '',
      chiphidv: '',
      ngaybatdau: '',
      ngayketthuc: '',
      trangthai: 1,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createConsignmentMutation.mutateAsync(data);
      toast.success('Hợp đồng bán hàng đã được tạo thành công');
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
          <DialogTitle>Tạo hợp đồng bán hàng</DialogTitle>
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
                      onChange={(e) => field.onChange(e.target.value)}
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
                      onChange={(e) => field.onChange(e.target.value)}
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
                  <FormLabel>Giá trị hợp đồng</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập giá trị hợp đồng"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chiphidv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phí dịch vụ</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập phí dịch vụ"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ngaybatdau"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày bắt đầu</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ngayketthuc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày kết thúc</FormLabel>
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
