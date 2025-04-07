import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  useConsignmentByIdQuery,
  useUpdateConsignmentMutation,
} from '@/queries/useConsignment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { realEstateStatus } from '@/constants/enums';
import { toast } from 'react-toastify';

const ConsignmentDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useConsignmentByIdQuery(id);
  const consignment = data?.data;
  const updateConsignmentMutation = useUpdateConsignmentMutation();

  const handleCancelConsignment = async () => {
    try {
      await updateConsignmentMutation.mutateAsync({ id });
      toast.success('Consignment contract has been cancelled');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel consignment');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!consignment) {
    return <div className="flex justify-center p-8">Consignment not found</div>;
  }

  const getStatusText = (status) => {
    switch (status) {
      case realEstateStatus.ACTIVE:
        return 'Active';
      case realEstateStatus.EXPIRED:
        return 'Expired';
      case realEstateStatus.DEPOSITED:
        return 'Deposited';
      case realEstateStatus.SOLD:
        return 'Sold';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="container py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hợp đồng ký gửi chi tiết</h1>
        <Button
          variant="destructive"
          onClick={handleCancelConsignment}
          disabled={consignment.trangthai === realEstateStatus.EXPIRED}
        >
          Hủy hợp đồng
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
                <span>{consignment.kgid}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Value:</span>
                <span>{formatCurrency(consignment.giatri)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Service Fee:</span>
                <span>{formatCurrency(consignment.chiphidv)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Start Date:</span>
                <span>{formatDate(consignment.ngaybatdau)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">End Date:</span>
                <span>{formatDate(consignment.ngayketthuc)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span>{getStatusText(consignment.trangthai)}</span>
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
                <span>{consignment.khid}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{consignment.khachhang?.hoten || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Address:</span>
                <span>{consignment.khachhang?.diachi || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">ID Card:</span>
                <span>{consignment.khachhang?.cmnd || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span>{consignment.khachhang?.sdt || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{consignment.khachhang?.email || 'N/A'}</span>
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
                  <span>{consignment.bdsid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Address:</span>
                  <span>
                    {`${consignment.batdongsan?.sonha || ''} ${
                      consignment.batdongsan?.tenduong || ''
                    }, 
                    ${consignment.batdongsan?.phuong || ''}, ${
                      consignment.batdongsan?.quan || ''
                    }, 
                    ${consignment.batdongsan?.thanhpho || ''}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Land Use Certificate:</span>
                  <span>{consignment.batdongsan?.masoqsdd || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Area:</span>
                  <span>{consignment.batdongsan?.dientich} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dimensions:</span>
                  <span>
                    {consignment.batdongsan?.chieudai || 'N/A'} x{' '}
                    {consignment.batdongsan?.chieurong || 'N/A'} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Price:</span>
                  <span>{formatCurrency(consignment.batdongsan?.dongia)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Commission Rate:</span>
                  <span>{consignment.batdongsan?.huehong}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="mb-2 font-medium">Description:</span>
                  <p className="text-sm">
                    {consignment.batdongsan?.mota || 'No description available'}
                  </p>
                </div>
                {consignment.batdongsan?.hinhanh && (
                  <div className="mt-4">
                    <span className="block mb-2 font-medium">
                      Property Image:
                    </span>
                    <img
                      src={consignment.batdongsan.hinhanh}
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

export default ConsignmentDetailPage;
