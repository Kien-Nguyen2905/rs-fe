import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useCreateStaffMutation } from '@/queries/useStaff';
import { useQueryClient } from '@tanstack/react-query';

// Form validation schema
const userSchema = z.object({
  taikhoan: z.string().min(3, 'Tài khoản phải có ít nhất 3 ký tự'),
  matkhau: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  tennv: z.string().min(2, 'Tên người dùng không được để trống'),
  sdt: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  diachi: z.string().min(5, 'Địa chỉ không được để trống'),
  ngaysinh: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Ngày sinh không hợp lệ',
  }),
  gioitinh: z.coerce.number(),
  email: z.string().email('Email không hợp lệ'),
  quyen: z.coerce.number(),
});

export function CreateUserForm({ trigger, onSuccess }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const createStaffMutation = useCreateStaffMutation();

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      taikhoan: '',
      matkhau: '',
      tennv: '',
      sdt: '',
      diachi: '',
      ngaysinh: '',
      gioitinh: 1,
      email: '',
      quyen: 0,
    },
  });

  const onSubmit = async (values) => {
    try {
      const result = await createStaffMutation.mutateAsync(values);

      if (result.code === 200) {
        toast.success('Người dùng đã được tạo thành công!');
        form.reset();
        setOpen(false);
        // Invalidate staff list query to refresh data
        queryClient.invalidateQueries(['staffList']);
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi tạo người dùng');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Có lỗi xảy ra khi tạo người dùng');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Thêm tài khoản nhân viên</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="py-4 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="taikhoan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tài khoản</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tài khoản" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="matkhau"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tennv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập email" {...field} />
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
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="diachi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
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
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Nam</SelectItem>
                        <SelectItem value="1">Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quyen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quyền</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quyền" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Admin</SelectItem>
                        <SelectItem value="1">Nhân viên</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Đang tạo...' : 'Tạo người dùng'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
