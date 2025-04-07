import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  useDepositByIdQuery,
  useCancelDepositMutation,
} from '@/queries/useDeposit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { toast } from 'react-toastify';

// Define deposit status constants
const depositStatus = {
  EXPIRED: 0,
  ACTIVE: 1,
};

const DepositDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useDepositByIdQuery(id);
  const deposit = data?.data;
  const cancelDepositMutation = useCancelDepositMutation();

  const handleCancelDeposit = async () => {
    try {
      await cancelDepositMutation.mutateAsync(deposit.dcid);
      toast.success('Deposit contract has been cancelled successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel deposit contract');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!deposit) {
    return (
      <div className="flex justify-center p-8">Deposit contract not found</div>
    );
  }

  const getStatusText = (status) => {
    switch (status) {
      case depositStatus.ACTIVE:
        return 'Active';
      case depositStatus.EXPIRED:
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="container py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hợp đồng đặt cọc chi tiết</h1>
        <Button
          variant="destructive"
          onClick={handleCancelDeposit}
          disabled={deposit.tinhtrang === depositStatus.EXPIRED}
        >
          Huỷ hợp đồng
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin hợp đồng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Contract ID:</span>
                <span>{deposit.dcid}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Value:</span>
                <span>{formatCurrency(deposit.giatri)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Contract Date:</span>
                <span>{formatDate(deposit.ngaylaphd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Expiration Date:</span>
                <span>{formatDate(deposit.ngayhethan)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
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
                <span className="font-medium">Khách hàng ID:</span>
                <span>{deposit.khachhang?.khid || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{deposit.khachhang?.hoten || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Address:</span>
                <span>{deposit.khachhang?.diachi || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">ID Card:</span>
                <span>{deposit.khachhang?.cmnd || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
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
                  <span className="font-medium">Property ID:</span>
                  <span>{deposit.batdongsan?.bdsid || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Address:</span>
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
                  <span className="font-medium">Area:</span>
                  <span>{deposit.batdongsan?.dientich || 'N/A'} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dimensions:</span>
                  <span>
                    {deposit.batdongsan?.chieudai || 'N/A'} x{' '}
                    {deposit.batdongsan?.chieurong || 'N/A'} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Price:</span>
                  <span>{formatCurrency(deposit.batdongsan?.dongia)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="mb-2 font-medium">Description:</span>
                  <p className="text-sm">
                    {deposit.batdongsan?.mota || 'No description available'}
                  </p>
                </div>
                {deposit.batdongsan?.hinhanh && (
                  <div className="mt-4">
                    <span className="block mb-2 font-medium">
                      Property Image:
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
    </div>
  );
};

export default DepositDetailPage;
