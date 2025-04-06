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
import { handleError } from '@/utils/utils';
import { realEstateSchemaBase } from '@/schemas/realEstateSchema';
import { X, Plus, RefreshCw } from 'lucide-react';
import {
  useEstateByIdQuery,
  useTypeEstateQuery,
  useUpdateEstateMutation,
} from '@/queries/useEstate';

export function UpdatePropertyForm({ propertyId, trigger }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const { data: estateTypeList } = useTypeEstateQuery();
  const updateEstateMutation = useUpdateEstateMutation();
  const { data } = useEstateByIdQuery(propertyId);
  const property = data?.data || [];
  const form = useForm({
    resolver: zodResolver(realEstateSchemaBase),
    defaultValues: {
      loaiid: '',
      khid: '',
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
      hinhanh: '',
    },
  });

  useEffect(() => {
    if (property && Object.keys(property).length > 0) {
      form.reset({
        loaiid: property.loaiid || '',
        khid: property.khid || '',
        dientich: property.dientich || '',
        dongia: property.dongia || '',
        masoqsdd: property.masoqsdd || '',
        mota: property.mota || '',
        chieudai: property.chieudai || '',
        chieurong: property.chieurong || '',
        huehong: property.huehong || 1,
        tenduong: property.tenduong || '',
        thanhpho: property.thanhpho || '',
        sonha: property.sonha || '',
        quan: property.quan || '',
        phuong: property.phuong || '',
        hinhanh: property.hinhanh || '',
      });
      // Initialize image preview from existing property images
      if (property?.dshinhanh?.length > 0) {
        const initialPreview = property.dshinhanh?.map((img) => ({
          url: img,
          isExisting: true,
          file: null,
        }));
        setImagePreview(initialPreview);
      }
    }
  }, [property, form]);
  const handleFileChange = (e, index = null) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);

      if (index !== null) {
        // Update a specific image
        const file = selectedFiles[0];
        const fileUrl = URL.createObjectURL(file);

        setImagePreview((prev) => {
          const updated = [...prev];
          updated[index] = {
            url: fileUrl,
            isExisting: false,
            file: file,
          };
          return updated;
        });
      } else {
        // Add new images, but respect the 5 image limit
        const newImages = selectedFiles.map((file) => ({
          url: URL.createObjectURL(file),
          isExisting: false,
          file: file,
        }));

        setImagePreview((prev) => {
          // Check if adding these would exceed 5 images
          if (prev.length + newImages.length > 5) {
            toast.warning('Tối đa 5 hình ảnh được phép tải lên');
            // Only add images up to the limit
            return [...prev, ...newImages.slice(0, 5 - prev.length)];
          }
          return [...prev, ...newImages];
        });
      }
    }
  };

  const removeImage = (index) => {
    setImagePreview((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const addImageField = () => {
    // Check if already at the 5 image limit
    if (imagePreview.length >= 5) {
      toast.warning('Tối đa 5 hình ảnh được phép tải lên');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleFileChange(e);
    input.click();
  };

  const replaceImage = (index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleFileChange(e, index);
    input.click();
  };

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Add form values to FormData
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      // Process images
      // First, remove any existing hinhanh field
      formData.delete('hinhanh');

      // Process images - convert all to files before sending
      if (imagePreview && imagePreview.length > 0) {
        const imagePromises = imagePreview.map(async (img) => {
          if (!img.isExisting && img.file) {
            // New image: already a file
            return img.file;
          } else if (img.isExisting) {
            // Existing image: convert URL to file
            try {
              const response = await fetch(img.url);
              console.log('Response:', response);
              const blob = await response.blob();
              console.log('blob:', blob);
              // Create a file from the blob with a name derived from the URL
              const filename =
                img.url.split('/').pop() || `image-${Date.now()}.jpg`;
              return new File([blob], filename, { type: blob.type });
            } catch (error) {
              console.error('Error converting image URL to file:', error);
              return null;
            }
          }
          return null;
        });

        // Wait for all image conversions to complete
        const imageFiles = await Promise.all(imagePromises);

        // Add all valid image files to formData
        imageFiles.filter(Boolean).forEach((file) => {
          formData.append('hinhanh', file);
        });
      }

      // Log form data contents safely
      console.log('Form Data Contents:');
      if (formData && typeof formData.entries === 'function') {
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }
      }

      const result = await updateEstateMutation.mutateAsync([
        propertyId,
        formData,
      ]);

      if (result.code === 200) {
        toast.success('Bất động sản đã được cập nhật thành công!');
        setOpen(false);
      } else {
        toast.error(
          result.message || 'Có lỗi xảy ra khi cập nhật bất động sản',
        );
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
        {trigger || (
          <Button variant="ghost" size="sm">
            Sửa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật bất động sản</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (error) => {
              console.log(error);
            })}
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
                    <textarea
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Mô tả chi tiết về bất động sản"
                      {...field}
                    />
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
              <div className="grid grid-cols-3 gap-2 mt-2">
                {imagePreview.map((img, index) => (
                  <div
                    key={index}
                    className="relative h-32 overflow-hidden border rounded-md"
                  >
                    <img
                      src={img.url}
                      alt={`Property ${index}`}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between p-1 bg-black bg-opacity-50">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-white h-7 w-7 hover:text-red-500"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-white h-7 w-7 hover:text-blue-400"
                        onClick={() => replaceImage(index)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                    {!img.isExisting && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white px-1 py-0.5 text-xs">
                        New
                      </div>
                    )}
                  </div>
                ))}

                {imagePreview.length < 5 && (
                  <div
                    className="flex items-center justify-center h-32 border border-dashed rounded-md cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={addImageField}
                  >
                    <div className="text-center">
                      <Plus className="w-8 h-8 mx-auto mb-1" />
                      <p className="text-sm">Thêm ảnh</p>
                    </div>
                  </div>
                )}
              </div>
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
                {isSubmitting ? 'Đang xử lý...' : 'Cập nhật'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
