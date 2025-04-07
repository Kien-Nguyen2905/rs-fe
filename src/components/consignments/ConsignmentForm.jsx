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
      toast.success('Consignment contract created successfully');
      form.reset();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to create consignment contract',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Consignment Contract</DialogTitle>
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
                  <FormLabel>Property ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter property ID"
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
                  <FormLabel>Contract Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter contract value"
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
                  <FormLabel>Service Fee</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter service fee"
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
                  <FormLabel>Start Date</FormLabel>
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
                  <FormLabel>End Date</FormLabel>
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
