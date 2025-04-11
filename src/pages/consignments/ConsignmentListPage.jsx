import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  useConsignmentListQuery,
  useDeleteConsignmentMutation,
} from '@/queries/useConsignment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ConsignmentForm } from '@/components/consignments/ConsignmentForm';
import { ArrowUpDown, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { realEstateStatus } from '@/constants/enums';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const ConsignmentListPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConsignments, setFilteredConsignments] = useState([]);
  const [isOpenCreateForm, setIsOpenCreateForm] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortField, setSortField] = useState('id');
  const limit = 8;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [consignmentToDelete, setConsignmentToDelete] = useState(null);
  const { data, isLoading } = useConsignmentListQuery({
    page,
    limit,
  });
  const { mutateAsync: deleteConsignment } = useDeleteConsignmentMutation();
  const consignments = data?.data || [];
  const totalPages = data?.totalPage || 0;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchTerm('');
  };

  const toggleSortOrder = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Apply sorting to filtered consignments
  const sortedConsignments = [...filteredConsignments].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (sortOrder === 'asc') {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });

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

  const getStatusClass = (status) => {
    switch (status) {
      case realEstateStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case realEstateStatus.EXPIRED:
        return 'bg-red-100 text-red-800';
      case realEstateStatus.DEPOSITED:
        return 'bg-blue-100 text-blue-800';
      case realEstateStatus.SOLD:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleDeleteClick = (consignment) => {
    setConsignmentToDelete(consignment);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (consignmentToDelete) {
        await deleteConsignment(consignmentToDelete.kgid);
        setDeleteDialogOpen(false);
        setConsignmentToDelete(null);
        toast.success('Hợp đồng đã được xóa thành công');
      }
    } catch (error) {
      toast.error(
        error.response.data.message || 'Có lỗi xảy ra khi xóa hợp đồng',
      );
      setDeleteDialogOpen(false);
      setConsignmentToDelete(null);
    }
  };
  // Apply filtering based on customer name
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredConsignments(consignments);
    } else {
      const filtered = consignments.filter((consignment) =>
        (consignment.khachhang?.hoten || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
      setFilteredConsignments(filtered);
    }
  }, [consignments, searchTerm, deleteConsignment]);

  return (
    <div className="container py-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hợp đồng ký gửi</h1>
          <p className="text-muted-foreground">Quản lý hợp đồng ký gửi</p>
        </div>
        <Button onClick={() => setIsOpenCreateForm(true)}>Tạo hợp đồng</Button>
      </div>

      <div className="flex items-center mb-4">
        <div className="relative max-w-sm">
          <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm khách hàng"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách hợp đồng</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              Đang tải...
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      onClick={() => toggleSortOrder('id')}
                      className="cursor-pointer"
                    >
                      ID{' '}
                      {sortField === 'id' && (
                        <ArrowUpDown className="inline w-4 h-4 ml-2" />
                      )}
                    </TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead
                      onClick={() => toggleSortOrder('giatri')}
                      className="cursor-pointer"
                    >
                      Trị giá{' '}
                      {sortField === 'giatri' && (
                        <ArrowUpDown className="inline w-4 h-4 ml-2" />
                      )}
                    </TableHead>
                    <TableHead
                      onClick={() => toggleSortOrder('ngaybatdau')}
                      className="cursor-pointer"
                    >
                      Ngày lập hợp đồng{' '}
                      {sortField === 'ngaybatdau' && (
                        <ArrowUpDown className="inline w-4 h-4 ml-2" />
                      )}
                    </TableHead>
                    <TableHead
                      onClick={() => toggleSortOrder('ngayketthuc')}
                      className="cursor-pointer"
                    >
                      Ngày hết hạn{' '}
                      {sortField === 'ngayketthuc' && (
                        <ArrowUpDown className="inline w-4 h-4 ml-2" />
                      )}
                    </TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedConsignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan="8" className="text-center">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedConsignments.map((consignment) => (
                      <TableRow key={consignment.kgid}>
                        <TableCell>{consignment.kgid}</TableCell>
                        <TableCell>
                          {consignment.batdongsan?.diachi ||
                            `${consignment.batdongsan?.sonha || ''} ${
                              consignment.batdongsan?.tenduong || ''
                            }, 
                           ${consignment.batdongsan?.quan || ''}, ${
                              consignment.batdongsan?.thanhpho || ''
                            }` ||
                            'N/A'}
                        </TableCell>
                        <TableCell>
                          {consignment.khachhang?.hoten || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(consignment.giatri)}
                        </TableCell>
                        <TableCell>
                          {formatDate(consignment.ngaybatdau)}
                        </TableCell>
                        <TableCell>
                          {formatDate(consignment.ngayketthuc)}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(
                              consignment.trangthai,
                            )}`}
                          >
                            {getStatusText(consignment.trangthai)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/consignments/${consignment.kgid}`}>
                                Xem
                              </Link>
                            </Button>
                            <Button
                              onClick={() => handleDeleteClick(consignment)}
                              variant="outline"
                              size="sm"
                            >
                              Xóa
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => page > 1 && handlePageChange(page - 1)}
                          className={
                            page === 1
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>

                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // Show first page, last page, and pages around current page
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= page - 1 && pageNumber <= page + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                onClick={() => handlePageChange(pageNumber)}
                                isActive={pageNumber === page}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          pageNumber === page - 2 ||
                          pageNumber === page + 2
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            page < totalPages && handlePageChange(page + 1)
                          }
                          className={
                            page === totalPages
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Bạn có chắc chắn muốn xóa hợp đồng {consignmentToDelete?.kgid}?
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConsignmentForm
        open={isOpenCreateForm}
        onOpenChange={setIsOpenCreateForm}
        onClose={() => setIsOpenCreateForm(false)}
      />
    </div>
  );
};

export default ConsignmentListPage;
