import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transferContractSchema } from '@/schemas/transferSchema';
import { useCreateTransferMutation } from '@/queries/useTransfer';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { handleError } from '@/utils/utils';

export const TransferForm = ({ isOpen, onClose, depositId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTransferMutation = useCreateTransferMutation();

  // Initialize the form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(transferContractSchema),
    defaultValues: {
      dcid: depositId | '',
      giatri: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createTransferMutation.mutateAsync(data);
      toast.success('Hợp đồng chuyển nhượng đã được tạo thành công');
      onClose();
    } catch (error) {
      handleError({ error: error, setError: form.setError });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo hợp đồng chuyển nhượng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dcid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã hợp đồng cọc</FormLabel>
                  <FormControl>
                    <Input
                      disabled={depositId}
                      type="number"
                      placeholder="Nhập mã hợp đồng cọc"
                      {...field}
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang tạo...' : 'Tạo hợp đồng'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
