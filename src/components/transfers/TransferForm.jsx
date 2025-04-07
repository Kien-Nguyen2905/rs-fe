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

export const TransferForm = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTransferMutation = useCreateTransferMutation();

  // Initialize the form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(transferContractSchema),
    defaultValues: {
      dcid: '',
      giatri: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createTransferMutation.mutateAsync(data);
      toast.success('Transfer contract created successfully');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to create transfer contract');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Transfer Contract</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dcid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deposit Contract ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter deposit contract ID"
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
                  <FormLabel>Contract Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter contract value"
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
                {isSubmitting ? 'Creating...' : 'Create Transfer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
