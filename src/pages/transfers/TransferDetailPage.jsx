import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  useTransferByIdQuery,
  useCancelTransferMutation,
} from '@/queries/useTransfer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { toast } from 'react-toastify';

const TransferDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useTransferByIdQuery(id);
  const transfer = data?.data;
  const cancelTransferMutation = useCancelTransferMutation();

  const handleCancelTransfer = async () => {
    try {
      await cancelTransferMutation.mutateAsync(id);
      toast.success('Transfer contract has been cancelled');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel transfer');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!transfer) {
    return <div className="flex justify-center p-8">Transfer not found</div>;
  }

  return (
    <div className="container py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hợp đồng chuyển nhượng chi tiết</h1>
        <Button
          variant="destructive"
          onClick={handleCancelTransfer}
          disabled={transfer.trangthai !== 0 && transfer.trangthai !== 1}
        >
          Xoá hợp đồng
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
                <span>{transfer.cnid}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Value:</span>
                <span>{formatCurrency(transfer.giatri)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Deposit Amount:</span>
                <span>{formatCurrency(transfer.hddatcoc.giatri)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
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
                <span className="font-medium">Khách hàng ID:</span>
                <span>{transfer.khid}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{transfer.khachhang?.hoten || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Address:</span>
                <span>{transfer.khachhang?.diachi || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">ID Card:</span>
                <span>{transfer.khachhang?.cmnd || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
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
                  <span className="font-medium">Property ID:</span>
                  <span>{transfer.bdsid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Address:</span>
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
                  <span className="font-medium">Land Use Certificate:</span>
                  <span>{transfer.batdongsan?.masoqsdd || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Area:</span>
                  <span>{transfer.batdongsan?.dientich} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dimensions:</span>
                  <span>
                    {transfer.batdongsan?.chieudai || 'N/A'} x{' '}
                    {transfer.batdongsan?.chieurong || 'N/A'} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Price:</span>
                  <span>{formatCurrency(transfer.batdongsan?.dongia)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Commission Rate:</span>
                  <span>{transfer.batdongsan?.huehong}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="mb-2 font-medium">Description:</span>
                  <p className="text-sm">
                    {transfer.batdongsan?.mota || 'No description available'}
                  </p>
                </div>
                {transfer.batdongsan?.hinhanh && (
                  <div className="mt-4">
                    <span className="block mb-2 font-medium">
                      Property Image:
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
              <CardTitle>Deposit Contract Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Deposit ID:</span>
                    <span>{transfer.dcid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Contract Date:</span>
                    <span>{formatDate(transfer.hddatcoc.ngaylaphd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span>{formatCurrency(transfer.hddatcoc.giatri)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span>
                      {transfer.hddatcoc.tinhtrang === 0
                        ? 'Active'
                        : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Expiry Date:</span>
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
