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
import { useUpdateStaffMutation } from '@/queries/useStaff';
import { useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '@/context/AppContext';
import { ROLES } from '@/constants/role';
import { updateStaffSchema } from '@/schemas/staffSchema';

const formatDateForInput = (dateString) => {
  return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
};

export function UpdateUserForm({ user, trigger, onSuccess }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const updateStaffMutation = useUpdateStaffMutation();
  const { role } = useAppContext();

  const isAdmin = role !== null && parseInt(role) === ROLES.ADMIN;

  const form = useForm({
    resolver: zodResolver(updateStaffSchema),
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
      trangthai: 1,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        taikhoan: user.taikhoan || '',
        tennv: user.tennv || '',
        sdt: user.sdt || '',
        diachi: user.diachi || '',
        ngaysinh: user.ngaysinh ? formatDateForInput(user.ngaysinh) : '',
        gioitinh: user.gioitinh,
        email: user.email || '',
        quyen: user.quyen,
        matkhau: '', // Password field is empty by default when updating
        trangthai: user.trangthai || 1,
      });
    }
  }, [user, form]);

  const onSubmit = async (values) => {
    try {
      // Add the staff ID for the update call
      const updatedUser = {
        ...values,
        nvid: user.nvid,
      };

      const result = await updateStaffMutation.mutateAsync({
        id: user.nvid,
        data: updatedUser,
      });

      if (result.code === 200) {
        toast.success('Người dùng đã được cập nhật thành công!');
        setOpen(false);
        // Invalidate staff list query to refresh data
        queryClient.invalidateQueries(['staffList']);
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi cập nhật người dùng');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Có lỗi xảy ra khi cập nhật người dùng');
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
          <DialogTitle>Cập nhật người dùng</DialogTitle>
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
                    <FormLabel>
                      Mật khẩu (để trống nếu không thay đổi)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
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
              {isAdmin && (
                <FormField
                  control={form.control}
                  name="quyen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quyền</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
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
              )}
            </div>

            <FormField
              control={form.control}
              name="trangthai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Hoạt động</SelectItem>
                      <SelectItem value="0">Tạm khóa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={updateStaffMutation.isLoading}>
                {updateStaffMutation.isLoading ? 'Đang xử lý...' : 'Lưu'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
