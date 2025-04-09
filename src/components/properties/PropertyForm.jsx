import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { realEstateSchemaBase } from '@/schemas/realEstateSchema';
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
import { handleError } from '@/utils/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import {
  useTypeEstateQuery,
  useCreateEstateMutation,
} from '@/queries/useEstate';

export default function PropertyForm({ trigger, customerId }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const { data: estateTypeList } = useTypeEstateQuery();
  const createEstateMutation = useCreateEstateMutation();

  const form = useForm({
    resolver: zodResolver(realEstateSchemaBase),
    defaultValues: {
      loaiid: '',
      khid: customerId || '',
      dientich: '',
      dongia: '',
      masoqsdd: '',
      mota: '',
      chieudai: '',
      chieurong: '',
      huehong: 1,
      tenduong: '',
      thanhpho: '',
      sonha: '',
      quan: '',
      phuong: '',
    },
  });

  const handleFileChange = (e) => {
    if (e.target.files) {
      let selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length > 5) {
        toast.warn('Bạn chỉ có thể tải lên tối đa 5 hình ảnh.');
        setFiles([]);
      } else {
        setFiles(selectedFiles);
      }
    }
  };

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      if (files.length === 0) {
        form.setError('hinhanh', {
          type: 'manual',
          message: 'Vui lòng chọn ít nhất 1 hình ảnh',
        });
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();

      // Add form values to FormData
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });
      // Add files to FormData
      files.forEach((file) => {
        formData.append('hinhanh', file);
      });

      const result = await createEstateMutation.mutateAsync(formData);

      if (result.code === 200) {
        toast.success('Bất động sản đã được tạo thành công!');
        form.reset();
        setFiles([]);
        setOpen(false);
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi tạo bất động sản');
      }
    } catch (error) {
      handleError({ error: error, setError: form.setError });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Thêm bất động sản</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm bất động sản mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="py-4 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="loaiid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại BĐS</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value.toString() : ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại BĐS" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {estateTypeList?.data?.map((type) => (
                          <SelectItem
                            key={type.loaiid}
                            value={type.loaiid.toString()}
                          >
                            {type.tenloai}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                name="dientich"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diện tích (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập diện tích"
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
                name="dongia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đơn giá</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Đơn giá"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="chieudai"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chiều dài (m)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Chiều dài"
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
                name="chieurong"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chiều rộng (m)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Chiều rộng"
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
                name="huehong"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter commission percentage"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="masoqsdd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã số QSDD</FormLabel>
                  <FormControl>
                    <Input placeholder="Mã số quyền sử dụng đất" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input placeholder="Mô tả bất động sản" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sonha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số nhà</FormLabel>
                    <FormControl>
                      <Input placeholder="Số nhà" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tenduong"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đường</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên đường" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="phuong"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phường/Xã</FormLabel>
                    <FormControl>
                      <Input placeholder="Phường/Xã" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quận/Huyện</FormLabel>
                    <FormControl>
                      <Input placeholder="Quận/Huyện" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thanhpho"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thành phố</FormLabel>
                    <FormControl>
                      <Input placeholder="Thành phố" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Hình ảnh (tối đa 5 hình)</FormLabel>
              <div
                className="p-6 mt-1 text-center border border-dashed rounded-md cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">Nhấp để tải lên hình ảnh BĐS</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {files.length > 0 && (
                  <p className="mt-2 text-sm">
                    {files.length} hình ảnh đã chọn
                  </p>
                )}
              </div>
              {form.formState.errors.hinhanh && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.hinhanh.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang xử lý...' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
