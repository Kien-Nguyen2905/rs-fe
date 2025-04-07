import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useDepositListQuery } from '@/queries/useDeposit'; // Use deposit query
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DepositForm } from '@/components/deposits/DepositForm'; // Use deposit form
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
import { depositContractStatus } from '@/constants/enums';
// Removed realEstateStatus import as deposit status logic might differ

const DepositListPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [isOpenCreateForm, setIsOpenCreateForm] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortField, setSortField] = useState('dcid'); // Default sort by deposit ID
  const limit = 10;

  const { data, isLoading } = useDepositListQuery({
    // Use deposit list query
    page,
    limit,
    // Add other potential query params like sort, filter if supported by API
  });

  const deposits = data?.data || [];
  const totalPages = data?.totalPage || 0;

  // Apply filtering based on customer name
  useEffect(() => {
    if (!deposits) return;
    if (searchTerm.trim() === '') {
      setFilteredDeposits(deposits);
    } else {
      const filtered = deposits.filter((deposit) =>
        (deposit.khachhang?.hoten || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
      setFilteredDeposits(filtered);
    }
  }, [deposits, searchTerm]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchTerm(''); // Reset search on page change
  };

  const toggleSortOrder = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Apply sorting to filtered deposits
  const sortedDeposits = [...filteredDeposits].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];

    // Handle nested fields for sorting if necessary (e.g., customer name)
    if (sortField === 'khachhang.hoten') {
      fieldA = a.khachhang?.hoten || '';
      fieldB = b.khachhang?.hoten || '';
    } else if (sortField === 'batdongsan.diachi') {
      // Construct address string for sorting
      const getAddress = (bds) =>
        bds
          ? `${bds.sonha || ''} ${bds.tenduong || ''}, ${bds.quan || ''}, ${
              bds.thanhpho || ''
            }`.trim()
          : '';
      fieldA = getAddress(a.batdongsan);
      fieldB = getAddress(b.batdongsan);
    }

    // Ensure consistent comparison (e.g., lowercase for strings)
    if (typeof fieldA === 'string') fieldA = fieldA.toLowerCase();
    if (typeof fieldB === 'string') fieldB = fieldB.toLowerCase();

    if (sortOrder === 'asc') {
      return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
    } else {
      return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
    }
  });

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

  const getStatusClass = (status) => {
    switch (status) {
      case depositContractStatus.CANCELED:
        return 'bg-yellow-100 text-yellow-800';
      case depositContractStatus.DEPOSITED:
        return 'bg-green-100 text-green-800';
      case depositContractStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container py-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hợp đồng đặt cọc
          </h1>
          <p className="text-muted-foreground">Quản lý hợp đồng đặt cọc</p>
        </div>
        <Button onClick={() => setIsOpenCreateForm(true)}>Tạo hợp đồng</Button>
      </div>

      <div className="flex items-center mb-4">
        <div className="relative max-w-sm">
          {/* Assuming search by customer name */}
          <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm khách hàng"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Add other search/filter inputs if needed */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách hợp đồng</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              Loading...
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      onClick={() => toggleSortOrder('dcid')}
                      className="cursor-pointer min-w-[80px]"
                    >
                      ID{' '}
                      {sortField === 'dcid' && (
                        <ArrowUpDown className="inline w-4 h-4 ml-1" />
                      )}
                    </TableHead>
                    <TableHead
                      onClick={() => toggleSortOrder('batdongsan.diachi')}
                      className="cursor-pointer"
                    >
                      Địa chỉ{' '}
                      {sortField === 'batdongsan.diachi' && (
                        <ArrowUpDown className="inline w-4 h-4 ml-1" />
                      )}
                    </TableHead>
                    <TableHead
                      onClick={() => toggleSortOrder('khachhang.hoten')}
                      className="cursor-pointer"
                    >
                      Khách hàng{' '}
                      {sortField === 'khachhang.hoten' && (
                        <ArrowUpDown className="inline w-4 h-4 ml-1" />
                      )}
                    </TableHead>
                    <TableHead
                      onClick={() => toggleSortOrder('giatri')}
                      className="text-right cursor-pointer"
                    >
                      Trị giá{' '}
                      {sortField === 'giatri' && (
                        <ArrowUpDown className="inline w-4 h-4 ml-1" />
                      )}
                    </TableHead>
                    <TableHead
                      onClick={() => toggleSortOrder('ngaylaphd')}
                      className="cursor-pointer"
                    >
                      Ngày lập hợp đồng{' '}
                      {sortField === 'ngaylaphd' && (
                        <ArrowUpDown className="inline w-4 h-4 ml-1" />
                      )}
                    </TableHead>
                    <TableHead
                      onClick={() => toggleSortOrder('ngayhethan')}
                      className="cursor-pointer"
                    >
                      Ngày hết hạn{' '}
                      {sortField === 'ngayhethan' && (
                        <ArrowUpDown className="inline w-4 h-4 ml-1" />
                      )}
                    </TableHead>
                    <TableHead
                      onClick={() => toggleSortOrder('tinhtrang')}
                      className="cursor-pointer"
                    >
                      Trạng thái{' '}
                      {sortField === 'tinhtrang' && (
                        <ArrowUpDown className="inline w-4 h-4 ml-1" />
                      )}
                    </TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedDeposits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan="8" className="h-24 text-center">
                        No results found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedDeposits.map((deposit) => (
                      <TableRow key={deposit.dcid}>
                        <TableCell>{deposit.dcid}</TableCell>
                        <TableCell>
                          {deposit.batdongsan
                            ? `${deposit.batdongsan.sonha || ''} ${
                                deposit.batdongsan.tenduong || ''
                              }, ${deposit.batdongsan.phuong || ''}, ${
                                deposit.batdongsan.quan || ''
                              }, ${deposit.batdongsan.thanhpho || ''}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {deposit.khachhang?.hoten || 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(deposit.giatri)}
                        </TableCell>
                        <TableCell>{formatDate(deposit.ngaylaphd)}</TableCell>
                        <TableCell>{formatDate(deposit.ngayhethan)}</TableCell>
                        <TableCell>
                          <div
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(
                              deposit.tinhtrang,
                            )}`}
                          >
                            {getStatusText(deposit.tinhtrang)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/deposits/${deposit.dcid}`}>Xem</Link>
                          </Button>
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
                        const showEllipsisBefore =
                          pageNumber === page - 2 && page > 3;
                        const showEllipsisAfter =
                          pageNumber === page + 2 && page < totalPages - 2;

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
                                className="cursor-pointer"
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (showEllipsisBefore || showEllipsisAfter) {
                          return (
                            <PaginationItem key={`ellipsis-${pageNumber}`}>
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

      {/* Deposit creation form dialog */}
      <DepositForm
        open={isOpenCreateForm}
        onOpenChange={setIsOpenCreateForm}
        onClose={() => setIsOpenCreateForm(false)}
      />
    </div>
  );
};

export default DepositListPage;
