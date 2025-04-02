import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCustomerByIdQuery } from '@/queries/useCustomer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatDate } from '@/utils/utils';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

const RequestItem = ({ request }) => {
  const getTypeLabel = (loaiid) => {
    const types = {
      1: 'Nhà riêng',
      2: 'Đất',
      3: 'Căn hộ',
      4: 'Văn phòng',
      5: 'Khác',
    };
    return types[loaiid] || 'Không xác định';
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Loại BĐS:</p>
          <p>{getTypeLabel(request.loaiid)}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Vị trí:</p>
          <p>{request.vitri}</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium">Mô tả:</p>
        <p>{request.mota}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Giá từ:</p>
          <p>{formatCurrency(request.giaf)}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Giá đến:</p>
          <p>{formatCurrency(request.giat)}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Diện tích từ:</p>
          <p>{request.daif} m²</p>
        </div>
        <div>
          <p className="text-sm font-medium">Diện tích đến:</p>
          <p>{request.dait} m²</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Chiều rộng từ:</p>
          <p>{request.rongf} m</p>
        </div>
        <div>
          <p className="text-sm font-medium">Chiều rộng đến:</p>
          <p>{request.rongt} m</p>
        </div>
      </div>
    </div>
  );
};

export default function CustomerDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetCustomerByIdQuery(id);
  const customer = data?.data;

  if (isLoading) {
    return <div className="container mx-auto my-8">Đang tải...</div>;
  }

  if (!customer) {
    return (
      <div className="container mx-auto my-8">
        Không tìm thấy thông tin khách hàng
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Thông tin khách hàng
        </h1>
        <p className="text-muted-foreground">Chi tiết thông tin khách hàng</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Thông tin chung</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2">
                  <span className="font-medium">Mã KH:</span>
                  <span>{customer.khid}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium">Họ tên:</span>
                  <span>{customer.hoten}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium">Giới tính:</span>
                  <span>{customer.gioitinh === 1 ? 'Nam' : 'Nữ'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium">Ngày sinh:</span>
                  <span>{formatDate(customer.ngaysinh)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium">CMND:</span>
                  <span>{customer.cmnd}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium">Loại KH:</span>
                  <span>
                    {customer.loaikh === 1
                      ? 'Khách hàng VIP'
                      : 'Khách hàng thường'}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium">Trạng thái:</span>
                  <span>
                    {customer.trangthai === 1 ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2">
                  <span className="font-medium">SĐT:</span>
                  <span>{customer.sdt}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium">Email:</span>
                  <span>{customer.email}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium">Địa chỉ:</span>
                  <span>{customer.diachi}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium">Địa chỉ thường trú:</span>
                  <span>{customer.diachitt}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu của khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {customer.requests && customer.requests.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {customer.requests.map((request, index) => (
                <AccordionItem
                  key={request.ycid}
                  value={`request-${request.ycid}`}
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="text-left">
                        Yêu cầu {index + 1} - {request.vitri}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(request.giaf)} -{' '}
                        {formatCurrency(request.giat)}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <RequestItem request={request} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p>Khách hàng chưa có yêu cầu</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
