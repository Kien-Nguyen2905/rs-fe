import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { PlusIcon, ArrowUpDown, Search } from 'lucide-react';
import { CreateUserForm } from '@/components/users/CreateUserForm';
import { UpdateUserForm } from '@/components/users/UpdateUserForm';
import { useStaffListQuery } from '@/queries/useStaff';
import { useAppContext } from '@/context/AppContext';
import { ROLES } from '@/constants/role';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate, getRoleName } from '@/utils/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export function UserListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');
  const itemsPerPage = 8;
  const { role } = useAppContext();
  const isAdmin = role !== null && parseInt(role) !== ROLES.STAFF;

  // Fetch all staff data without pagination params
  const { data: staffData, isLoading } = useStaffListQuery();

  // Filter staff based on search term
  const filteredUsers = (staffData?.data || []).filter((user) =>
    user.tennv.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sort users by revenue
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.doanhthu - b.doanhthu;
    } else {
      return b.doanhthu - a.doanhthu;
    }
  });

  // Calculate pagination
  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nhân viên</h1>
          <p className="text-muted-foreground">Quản lý nhân viên</p>
        </div>
        {isAdmin && (
          <CreateUserForm
            trigger={
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" /> Thêm nhân viên
              </Button>
            }
          />
        )}
      </div>

      <div className="flex items-center mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm theo tên nhân viên..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả nhân viên</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Tài khoản</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Quyền</TableHead>
                <TableHead onClick={toggleSortOrder} className="cursor-pointer">
                  Doanh thu
                  <ArrowUpDown className="inline w-4 h-4 ml-2" />
                </TableHead>
                {isAdmin && (
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.nvid}>
                  <TableCell>{user.nvid}</TableCell>
                  <TableCell className="font-medium">{user.tennv}</TableCell>
                  <TableCell>{user.taikhoan}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.sdt}</TableCell>
                  <TableCell>{formatDate(user.ngaysinh)}</TableCell>
                  <TableCell>{user.diachi}</TableCell>
                  <TableCell>{getRoleName(user.quyen)}</TableCell>
                  <TableCell>{formatCurrency(user.doanhthu)}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <UpdateUserForm user={user} />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                      className={
                        currentPage === 1
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
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNumber)}
                            isActive={pageNumber === currentPage}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    // Add ellipsis
                    if (
                      (pageNumber === 2 && currentPage > 3) ||
                      (pageNumber === totalPages - 1 &&
                        currentPage < totalPages - 2)
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
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
