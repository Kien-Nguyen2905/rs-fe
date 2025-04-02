import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCustomerListQuery } from '@/queries/useCustomer';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import CustomerForm from '@/components/customers/CustomerForm';
import { UpdateCustomerForm } from '@/components/customers/UpdateCustomerForm';
import CustomerRequestForm from '@/components/customers/CustomerRequestForm';
import { PlusIcon, Search, ArrowUpDown, Eye, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CustomerListPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortField, setSortField] = useState('khid');
  const limit = 10;

  const { data, isLoading } = useCustomerListQuery({
    page,
    limit,
  });

  const customers = data?.data || [];
  const totalPages = data?.totalPage || 0;

  // Apply filtering when customers or searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.hoten.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.sdt.includes(searchTerm) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.khid.toString().includes(searchTerm),
      );
      setFilteredCustomers(filtered);
    }
  }, [customers, searchTerm]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchTerm(''); // Reset search when page changes
  };

  const toggleSortOrder = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Apply sorting to filtered customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (sortOrder === 'asc') {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Khách hàng</h1>
          <p className="text-muted-foreground">Quản lý danh sách khách hàng</p>
        </div>
        <CustomerForm
          trigger={
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" /> Thêm khách hàng
            </Button>
          }
          onSuccess={() => handlePageChange(page)}
        />
      </div>

      <div className="flex items-center mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng</CardTitle>
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
                      onClick={() => toggleSortOrder('khid')}
                      className="cursor-pointer"
                    >
                      Mã KH{' '}
                      {sortField === 'khid' && (
                        <ArrowUpDown className="inline w-4 h-4 ml-2" />
                      )}
                    </TableHead>
                    <TableHead
                      onClick={() => toggleSortOrder('hoten')}
                      className="cursor-pointer"
                    >
                      Họ tên{' '}
                      {sortField === 'hoten' && (
                        <ArrowUpDown className="inline w-4 h-4 ml-2" />
                      )}
                    </TableHead>
                    <TableHead>SĐT</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>CMND</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan="8" className="text-center">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedCustomers.map((customer) => (
                      <TableRow key={customer.khid}>
                        <TableCell>{customer.khid}</TableCell>
                        <TableCell className="font-medium">
                          {customer.hoten}
                        </TableCell>
                        <TableCell>{customer.sdt}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.cmnd}</TableCell>
                        <TableCell>{customer.diachi}</TableCell>
                        <TableCell>
                          {customer.trangthai === 1
                            ? 'Hoạt động'
                            : 'Không hoạt động'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon" asChild>
                              <Link to={`/customers/${customer.khid}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <UpdateCustomerForm
                              customer={customer}
                              onSuccess={() => {
                                // Refresh data
                                handlePageChange(page);
                              }}
                            />
                            <CustomerRequestForm
                              customer={customer}
                              trigger={
                                <Button variant="outline" size="icon">
                                  <FileText className="w-4 h-4" />
                                </Button>
                              }
                              onSuccess={() => {
                                // No need to refresh as this doesn't change customer list
                                toast.success(
                                  `Đã tạo yêu cầu cho khách hàng ${customer.hoten}`,
                                );
                              }}
                            />
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
                        }

                        // Add ellipsis
                        if (
                          (pageNumber === 2 && page > 3) ||
                          (pageNumber === totalPages - 1 &&
                            page < totalPages - 2)
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
    </div>
  );
}
