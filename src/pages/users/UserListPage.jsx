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

export function UserListPage() {
  const { data: users, isLoading } = useStaffListQuery();
  const { role } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  const isAdmin = role !== null && parseInt(role) !== ROLES.STAFF;

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Filter and sort users
  const filteredAndSortedUsers = (Array.isArray(users?.data) ? users.data : [])
    .filter((user) =>
      user.tennv.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.doanhthu - b.doanhthu;
      } else {
        return b.doanhthu - a.doanhthu;
      }
    });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff</h1>
          <p className="text-muted-foreground">Manage your staff</p>
        </div>
        {isAdmin && (
          <CreateUserForm
            trigger={
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" /> Create staff
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
          <CardTitle>All staff</CardTitle>
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
              {filteredAndSortedUsers.map((user) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
