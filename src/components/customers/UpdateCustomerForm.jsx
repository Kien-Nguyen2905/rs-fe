import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateCustomerMutation } from '@/queries/useCustomer';
import { useQueryClient } from '@tanstack/react-query';
import { customerSchemaBase } from '@/schemas/customerSchema';

const formatDateForInput = (dateString) => {
  return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
};

export function UpdateCustomerForm({ customer, trigger, onSuccess }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const updateCustomerMutation = useUpdateCustomerMutation();

  const form = useForm({
    resolver: zodResolver(customerSchemaBase),
    defaultValues: {
      hoten: '',
      diachi: '',
      diachitt: '',
      cmnd: '',
      ngaysinh: '',
      sdt: '',
      gioitinh: 0,
      email: '',
      loaikh: 0,
      trangthai: 1,
    },
  });

  useEffect(() => {
    if (customer) {
      form.reset({
        hoten: customer.hoten || '',
        diachi: customer.diachi || '',
        diachitt: customer.diachitt || '',
        cmnd: customer.cmnd || '',
        ngaysinh: customer.ngaysinh
          ? formatDateForInput(customer.ngaysinh)
          : '',
        sdt: customer.sdt || '',
        gioitinh: customer.gioitinh,
        email: customer.email || '',
        loaikh: customer.loaikh,
        trangthai: customer.trangthai || 1,
      });
    }
  }, [customer, form]);

  const onSubmit = async (values) => {
    try {
      // Add the customer ID for the update call
      const updatedCustomer = {
        ...values,
        khid: customer.khid,
      };

      const result = await updateCustomerMutation.mutateAsync({
        id: customer.khid,
        ...updatedCustomer,
      });

      if (result.code === 200) {
        toast.success('Khách hàng đã được cập nhật thành công!');
        setOpen(false);
        // Invalidate customer list query to refresh data
        queryClient.invalidateQueries(['customerList']);
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi cập nhật khách hàng');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Có lỗi xảy ra khi cập nhật khách hàng');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            Sửa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật khách hàng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="py-4 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hoten"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ngaysinh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gioitinh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Nữ</SelectItem>
                        <SelectItem value="1">Nam</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cmnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CMND/CCCD</FormLabel>
                    <FormControl>
                      <Input placeholder="CMND/CCCD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sdt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="0xxxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diachi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder="Địa chỉ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diachitt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ thường trú</FormLabel>
                    <FormControl>
                      <Input placeholder="Địa chỉ thường trú" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loaikh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại khách hàng</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại khách hàng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Thường</SelectItem>
                        <SelectItem value="1">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trangthai"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Không hoạt động</SelectItem>
                        <SelectItem value="1">Hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateCustomerMutation.isLoading}>
                {updateCustomerMutation.isLoading ? 'Đang xử lý...' : 'Lưu'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
