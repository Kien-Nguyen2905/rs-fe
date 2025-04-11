import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  useTransferListQuery,
  useDeleteTransferMutation,
} from '@/queries/useTransfer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TransferForm } from '@/components/transfers/TransferForm';
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const TransferListPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransfers, setFilteredTransfers] = useState([]);
  const [isOpenCreateForm, setIsOpenCreateForm] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortField, setSortField] = useState('cnid');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transferToDelete, setTransferToDelete] = useState(null);
  const limit = 10;

  const { data, isLoading } = useTransferListQuery();
  const { mutateAsync: deleteTransfer } = useDeleteTransferMutation();

  const transfers = data?.data || [];
  const totalPages = Math.ceil(transfers.length / limit);

  // Apply filtering based on customer name
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTransfers(transfers);
    } else {
      const filtered = transfers.filter((transfer) =>
        (transfer.khachhang?.hoten || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
      setFilteredTransfers(filtered);
    }
  }, [transfers, searchTerm]);

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

  // Apply sorting to filtered transfers
  const sortedTransfers = [...filteredTransfers].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (sortOrder === 'asc') {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });

  // Get paginated transfers
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTransfers = sortedTransfers.slice(startIndex, endIndex);

  const handleDeleteClick = (transfer) => {
    setTransferToDelete(transfer);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (transferToDelete) {
        await deleteTransfer(transferToDelete.cnid);
        setDeleteDialogOpen(false);
        setTransferToDelete(null);
        toast.success('Hợp đồng đã được xóa thành công');
      }
    } catch (error) {
      toast.error(
        error.response.data.message || 'Có lỗi xảy ra khi xóa hợp đồng',
      );
      setDeleteDialogOpen(false);
      setTransferToDelete(null);
    }
  };

  return (
    <div className="container py-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hợp đồng chuyển nhượng
          </h1>
          <p className="text-muted-foreground">
            Quản lý hợp đồng chuyển nhượng
          </p>
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
                      onClick={() => toggleSortOrder('cnid')}
                      className="cursor-pointer"
                    >
                      ID{' '}
                      {sortField === 'cnid' && (
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
                      onClick={() => toggleSortOrder('ngaylap')}
                      className="cursor-pointer"
                    >
                      Ngày lập hợp đồng{' '}
                      {sortField === 'ngaylap' && (
                        <ArrowUpDown className="inline w-4 h-4 ml-2" />
                      )}
                    </TableHead>
                    <TableHead>Tiền đặt cọc</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransfers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Không có hợp đồng nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTransfers.map((transfer) => (
                      <TableRow key={transfer.cnid}>
                        <TableCell className="font-medium">
                          {transfer.cnid}
                        </TableCell>
                        <TableCell>
                          {`${transfer.batdongsan?.sonha || ''} ${
                            transfer.batdongsan?.tenduong || ''
                          }, ${transfer.batdongsan?.quan || ''}, ${
                            transfer.batdongsan?.thanhpho || ''
                          }`}
                        </TableCell>
                        <TableCell>
                          {transfer.khachhang?.hoten || 'N/A'}
                        </TableCell>
                        <TableCell>{formatCurrency(transfer.giatri)}</TableCell>
                        <TableCell>{formatDate(transfer.ngaylap)}</TableCell>
                        <TableCell>
                          {formatCurrency(transfer.tiendatcoc)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/transfers/${transfer.cnid}`}>
                                Xem
                              </Link>
                            </Button>
                            <Button
                              onClick={() => handleDeleteClick(transfer)}
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
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(Math.max(page - 1, 1))}
                        className={`cursor-pointer ${
                          page === 1 ? 'pointer-events-none opacity-50' : ''
                        }`}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={pageNum === page}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePageChange(Math.min(page + 1, totalPages))
                        }
                        className={`cursor-pointer ${
                          page === totalPages
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
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
            Bạn có chắc chắn muốn xóa hợp đồng {transferToDelete?.cnid}?
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

      {isOpenCreateForm && (
        <TransferForm
          isOpen={isOpenCreateForm}
          onClose={() => setIsOpenCreateForm(false)}
        />
      )}
    </div>
  );
};

export default TransferListPage;
