import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  useTransferByIdQuery,
  // useDeleteTransferMutation,
} from '@/queries/useTransfer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/utils/formatters';
// import { toast } from 'react-toastify';

const TransferDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useTransferByIdQuery(id);
  const transfer = data?.data;
  // const { mutateAsync: deleteTransfer } = useDeleteTransferMutation();

  // const handleCancelTransfer = async () => {
  //   try {
  //     await deleteTransfer.mutateAsync(id);
  //     toast.success('Hợp đồng đã được xóa thành công');
  //   } catch (error) {
  //     toast.error(error.message || 'Có lỗi xảy ra khi xóa hợp đồng');
  //   }
  // };

  if (isLoading) {
    return <div className="flex justify-center p-8">Đang tải...</div>;
  }

  if (!transfer) {
    return (
      <div className="flex justify-center p-8">Không tìm thấy hợp đồng</div>
    );
  }

  return (
    <div className="container py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hợp đồng chuyển nhượng chi tiết</h1>
        {/* <Button
          variant="destructive"
          onClick={handleCancelTransfer}
          disabled={transfer.trangthai !== 0 && transfer.trangthai !== 1}
        >
          Xoá hợp đồng
        </Button> */}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin hợp đồng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Mã hợp đồng:</span>
                <span>{transfer.cnid}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Giá trị:</span>
                <span>{formatCurrency(transfer.giatri)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Giá trị cọc:</span>
                <span>{formatCurrency(transfer.hddatcoc.giatri)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Ngày lập hợp đồng:</span>
                <span>{formatDate(transfer.ngaylap)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Mã khách hàng:</span>
                <span>{transfer.khid}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tên:</span>
                <span>{transfer.khachhang?.hoten || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Địa chỉ:</span>
                <span>{transfer.khachhang?.diachi || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">CMND:</span>
                <span>{transfer.khachhang?.cmnd || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Số điện thoại:</span>
                <span>{transfer.khachhang?.sdt || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{transfer.khachhang?.email || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin bất động sản</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Mã bất động sản:</span>
                  <span>{transfer.bdsid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Địa chỉ:</span>
                  <span>
                    {`${transfer.batdongsan?.sonha || ''} ${
                      transfer.batdongsan?.tenduong || ''
                    }, 
                    ${transfer.batdongsan?.phuong || ''}, ${
                      transfer.batdongsan?.quan || ''
                    }, 
                    ${transfer.batdongsan?.thanhpho || ''}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Mã số QSDD:</span>
                  <span>{transfer.batdongsan?.masoqsdd || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Area:</span>
                  <span>{transfer.batdongsan?.dientich} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Kích thước:</span>
                  <span>
                    {transfer.batdongsan?.chieudai || 'N/A'} x{' '}
                    {transfer.batdongsan?.chieurong || 'N/A'} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Giá:</span>
                  <span>{formatCurrency(transfer.batdongsan?.dongia)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tỷ lệ hoa hồng:</span>
                  <span>{transfer.batdongsan?.huehong}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="mb-2 font-medium">Mô tả:</span>
                  <p className="text-sm">
                    {transfer.batdongsan?.mota || 'Không có mô tả'}
                  </p>
                </div>
                {transfer.batdongsan?.hinhanh && (
                  <div className="mt-4">
                    <span className="block mb-2 font-medium">
                      Hình ảnh bất động sản:
                    </span>
                    <img
                      src={transfer.batdongsan.hinhanh}
                      alt="Property"
                      className="object-cover w-full h-auto rounded-md max-h-64"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {transfer.hddatcoc && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Thông tin hợp đồng cọc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Mã hợp đồng cọc:</span>
                    <span>{transfer.dcid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ngày lập hợp đồng:</span>
                    <span>{formatDate(transfer.hddatcoc.ngaylaphd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Giá trị:</span>
                    <span>{formatCurrency(transfer.hddatcoc.giatri)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Trạng thái:</span>
                    <span>
                      {transfer.hddatcoc.tinhtrang === 0
                        ? 'Active'
                        : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ngày hết hạn:</span>
                    <span>{formatDate(transfer.hddatcoc.ngayhethan)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TransferDetailPage;
