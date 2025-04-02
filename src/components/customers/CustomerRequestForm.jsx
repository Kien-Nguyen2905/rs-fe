import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { requestCustomerSchema } from '@/schemas/customerSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateRequestMutation } from '@/queries/useCustomer';
import { handleError } from '@/utils/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTypeEstateQuery } from '@/queries/useEstate';

export default function CustomerRequestForm({ customer, trigger, onSuccess }) {
  const [open, setOpen] = useState(false);
  const createRequestMutation = useCreateRequestMutation();
  const { data: estateTypeList } = useTypeEstateQuery();
  const form = useForm({
    resolver: zodResolver(requestCustomerSchema),
    defaultValues: {
      loaiid: 0,
      khid: customer?.khid || 0,
      vitri: '',
      giaf: 0,
      giat: 0,
      daif: 0,
      dait: 0,
      rongf: 0,
      rongt: 0,
    },
  });
  const onSubmit = async (values) => {
    try {
      const result = await createRequestMutation.mutateAsync(values);

      if (result.code === 200) {
        toast.success('Yêu cầu đã được tạo thành công!');
        form.reset();
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi tạo yêu cầu');
      }
    } catch (error) {
      handleError({ error: error, setError: form.setError });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Tạo yêu cầu</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo yêu cầu bất động sản</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="py-4 space-y-4"
          >
            <input
              type="hidden"
              {...form.register('khid')}
              value={customer?.khid || 0}
            />

            <FormField
              control={form.control}
              name="loaiid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại bất động sản</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {estateTypeList?.data?.map((item) => (
                        <SelectItem value={item.loaiid.toString()}>
                          {item.tenloai}
                        </SelectItem>
                      ))}

                      {/* <SelectItem value="2">Căn hộ</SelectItem>
                      <SelectItem value="3">Đất nền</SelectItem>
                      <SelectItem value="4">Văn phòng</SelectItem> */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vitri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vị trí</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ/khu vực" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="giaf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá từ (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Giá từ"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="giat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá đến (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Giá đến"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="daif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chiều dài từ (m)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Chiều dài từ"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dait"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chiều dài đến (m)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Chiều dài đến"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rongf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chiều rộng từ (m)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Chiều rộng từ"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rongt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chiều rộng đến (m)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Chiều rộng đến"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={createRequestMutation.isLoading}>
                {createRequestMutation.isLoading
                  ? 'Đang xử lý...'
                  : 'Tạo yêu cầu'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
