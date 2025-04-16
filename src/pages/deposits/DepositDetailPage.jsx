import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  useDepositByIdQuery,
  useCancelDepositMutation,
} from '@/queries/useDeposit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { toast } from 'react-toastify';
import { useTypeEstateQuery } from '@/queries/useEstate';
import { depositContractStatus } from '@/constants/enums';
import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { TransferForm } from '@/components/transfers/TransferForm';

const DepositDetailPage = () => {
  const { id } = useParams();
  const [showTransferForm, setShowTransferForm] = useState(false);
  const { data, isLoading } = useDepositByIdQuery(id);
  const deposit = data?.data;
  const cancelDepositMutation = useCancelDepositMutation();
  const { data: estateTypeList } = useTypeEstateQuery();

  const handleCancelDeposit = async () => {
    try {
      await cancelDepositMutation.mutateAsync(deposit.dcid);
      toast.success('Deposit contract has been cancelled successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel deposit contract');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Đang tải...</div>;
  }

  if (!deposit) {
    return (
      <div className="flex justify-center p-8">Không tìm thấy hợp đồng</div>
    );
  }

  const getStatusText = (status) => {
    switch (status) {
      case depositContractStatus.CANCELED:
        return 'Canceled'; // Or 'Active' if 0 means active
      case depositContractStatus.DEPOSITED:
        return 'Deposited';
      case depositContractStatus.COMPLETED:
        return 'Completed'; // Or 'Sold'
      default:
        return 'Unknown';
    }
  };
  return (
    <div className="container py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hợp đồng đặt cọc chi tiết</h1>
        <div className="flex gap-2">
          {deposit.tinhtrang === depositContractStatus.DEPOSITED && (
            <Button onClick={() => setShowTransferForm(true)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Tạo chuyển nhượng
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={handleCancelDeposit}
            disabled={deposit.tinhtrang === depositContractStatus.COMPLETED}
          >
            Huỷ hợp đồng
          </Button>
        </div>
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
                <span>{deposit.dcid}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Giá trị:</span>
                <span>{formatCurrency(deposit.giatri)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Ngày lập hợp đồng:</span>
                <span>{formatDate(deposit.ngaylaphd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Ngày hết hạn:</span>
                <span>{formatDate(deposit.ngayhethan)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Trạng thái:</span>
                <span>{getStatusText(deposit.tinhtrang)}</span>
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
                <span>{deposit.khachhang?.khid || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tên:</span>
                <span>{deposit.khachhang?.hoten || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Địa chỉ:</span>
                <span>{deposit.khachhang?.diachi || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">CMND:</span>
                <span>{deposit.khachhang?.cmnd || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Số điện thoại:</span>
                <span>{deposit.khachhang?.sdt || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{deposit.khachhang?.email || 'N/A'}</span>
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
                  <span className="font-medium">Loại bất động sản:</span>
                  <span>
                    {
                      estateTypeList?.data?.find(
                        (type) => type.loaiid === deposit.batdongsan.loaiid,
                      ).tenloai
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Địa chỉ:</span>
                  <span>
                    {`${deposit.batdongsan?.sonha || ''} ${
                      deposit.batdongsan?.tenduong || ''
                    }, 
                    ${deposit.batdongsan?.phuong || ''}, ${
                      deposit.batdongsan?.quan || ''
                    }, 
                    ${deposit.batdongsan?.thanhpho || ''}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Diện tích:</span>
                  <span>{deposit.batdongsan?.dientich || 'N/A'} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Kích thước:</span>
                  <span>
                    {deposit.batdongsan?.chieudai || 'N/A'} x{' '}
                    {deposit.batdongsan?.chieurong || 'N/A'} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Giá:</span>
                  <span>{formatCurrency(deposit.batdongsan?.dongia)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="mb-2 font-medium">Mô tả:</span>
                  <p className="text-sm">
                    {deposit.batdongsan?.mota || 'Không có mô tả'}
                  </p>
                </div>
                {deposit.batdongsan?.hinhanh && (
                  <div className="mt-4">
                    <span className="block mb-2 font-medium">
                      Hình ảnh bất động sản:
                    </span>
                    <img
                      src={deposit.batdongsan.hinhanh}
                      alt="Property"
                      className="object-cover w-full h-auto rounded-md max-h-64"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <TransferForm
        depositId={deposit?.dcid}
        isOpen={showTransferForm}
        onClose={() => setShowTransferForm(false)}
      />
    </div>
  );
};

export default DepositDetailPage;
