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
      toast.success('Deposit contract created successfully');
      form.reset();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to create deposit contract',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          {/* Updated Title */}
          <DialogTitle>Create Deposit Contract</DialogTitle>
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
                  <FormLabel>Khách hàng ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter customer ID"
                      {...field}
                      // Ensure value is passed correctly for controlled number input
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
                  <FormLabel>Property ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter property ID"
                      {...field}
                      // Ensure value is passed correctly for controlled number input
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
                  <FormLabel>Deposit Value</FormLabel> {/* Updated Label */}
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter deposit value"
                      {...field}
                      // Ensure value is passed correctly for controlled number input
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

            {/* Removed Service Fee (chiphidv) Field */}
            {/* Removed Start Date (ngaybatdau) Field */}

            <FormField
              control={form.control}
              name="ngayhethan" // Changed from ngayketthuc
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration Date</FormLabel> {/* Updated Label */}
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
