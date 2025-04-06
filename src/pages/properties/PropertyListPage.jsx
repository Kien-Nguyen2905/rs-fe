import { Link } from 'react-router-dom';
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
import { PlusIcon, SearchIcon, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useEstateQuery, useTypeEstateQuery } from '@/queries/useEstate';
import PropertyForm from '@/components/properties/PropertyForm';
import { UpdatePropertyForm } from '@/components/properties/UpdatePropertyForm';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { realEstateStatus } from '@/constants/enums';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function PropertyListPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortField, setSortField] = useState('bdsid');
  const [statusFilter, setStatusFilter] = useState('all');
  const limit = 10;

  const { data: estateResponse, isLoading, error } = useEstateQuery();
  const { data: estateTypeList } = useTypeEstateQuery();

  const properties = estateResponse?.data || [];
  const totalProperties = properties.length;
  const totalPages = Math.ceil(totalProperties / limit);

  // Apply filtering when properties, searchQuery, or statusFilter changes
  useEffect(() => {
    let filtered = [...properties];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((property) => {
        const searchTerm = searchQuery.toLowerCase();
        return property.masoqsdd?.toLowerCase().includes(searchTerm);
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      const statusValue = parseInt(statusFilter, 10);
      filtered = filtered.filter(
        (property) => property.tinhtrang === statusValue,
      );
    }

    setFilteredProperties(filtered);
  }, [properties, searchQuery, statusFilter]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchQuery(''); // Reset search when page changes
  };

  // Toggle sort order
  const toggleSortOrder = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Apply sorting to filtered properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (sortOrder === 'asc') {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });

  // Get paginated properties
  const getPaginatedProperties = () => {
    const startIndex = (page - 1) * limit;
    return sortedProperties.slice(startIndex, startIndex + limit);
  };

  // Function to determine status text from tinhtrang
  const getStatusText = (status) => {
    switch (status) {
      case realEstateStatus.EXPIRED:
        return 'Expired';
      case realEstateStatus.ACTIVE:
        return 'Available';
      case realEstateStatus.DEPOSITED:
        return 'Deposited';
      case realEstateStatus.SOLD:
        return 'Sold';
      default:
        return 'Unknown';
    }
  };

  // Function to get status color class
  const getStatusColor = (status) => {
    switch (status) {
      case realEstateStatus.EXPIRED:
        return 'bg-gray-100 text-gray-800';
      case realEstateStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case realEstateStatus.DEPOSITED:
        return 'bg-orange-100 text-orange-800';
      case realEstateStatus.SOLD:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Get property type name from ID
  const getPropertyTypeName = (loaiid) => {
    const propertyType = estateTypeList?.data?.find(
      (type) => type.loaiid === loaiid,
    );
    return propertyType?.tenloai || 'Không xác định';
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bất động sản</h1>
          <p className="text-muted-foreground">
            Quản lý danh sách bất động sản
          </p>
        </div>
        <PropertyForm
          trigger={
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" /> Thêm bất động sản
            </Button>
          }
        />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã số..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tình trạng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value={realEstateStatus.ACTIVE.toString()}>
              Hoạt động
            </SelectItem>
            <SelectItem value={realEstateStatus.DEPOSITED.toString()}>
              Đã đặt cọc
            </SelectItem>
            <SelectItem value={realEstateStatus.SOLD.toString()}>
              Đã bán
            </SelectItem>
            <SelectItem value={realEstateStatus.EXPIRED.toString()}>
              Hết hiệu lực
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bất động sản</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              Đang tải dữ liệu...
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              Có lỗi xảy ra khi tải dữ liệu
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {searchQuery
                ? 'Không tìm thấy bất động sản phù hợp với tìm kiếm'
                : 'Chưa có bất động sản nào'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hình ảnh</TableHead>
                      <TableHead
                        onClick={() => toggleSortOrder('masoqsdd')}
                        className="cursor-pointer"
                      >
                        Mã số{' '}
                        {sortField === 'masoqsdd' && (
                          <ArrowUpDown className="inline w-4 h-4 ml-2" />
                        )}
                      </TableHead>
                      <TableHead
                        onClick={() => toggleSortOrder('loaiid')}
                        className="cursor-pointer"
                      >
                        Loại{' '}
                        {sortField === 'loaiid' && (
                          <ArrowUpDown className="inline w-4 h-4 ml-2" />
                        )}
                      </TableHead>
                      <TableHead>Địa chỉ</TableHead>
                      <TableHead
                        onClick={() => toggleSortOrder('dientich')}
                        className="cursor-pointer"
                      >
                        Diện tích{' '}
                        {sortField === 'dientich' && (
                          <ArrowUpDown className="inline w-4 h-4 ml-2" />
                        )}
                      </TableHead>
                      <TableHead
                        onClick={() => toggleSortOrder('dongia')}
                        className="cursor-pointer"
                      >
                        Đơn giá{' '}
                        {sortField === 'dongia' && (
                          <ArrowUpDown className="inline w-4 h-4 ml-2" />
                        )}
                      </TableHead>
                      <TableHead
                        onClick={() => toggleSortOrder('tinhtrang')}
                        className="cursor-pointer"
                      >
                        Tình trạng{' '}
                        {sortField === 'tinhtrang' && (
                          <ArrowUpDown className="inline w-4 h-4 ml-2" />
                        )}
                      </TableHead>
                      <TableHead className="w-[100px]">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPaginatedProperties().map((property) => (
                      <TableRow key={property.bdsid}>
                        <TableCell>
                          {property.hinhanh ? (
                            <img
                              src={property.hinhanh}
                              className="object-cover w-12 h-12 rounded"
                              alt={property.masoqsdd}
                            />
                          ) : (
                            <div className="flex items-center justify-center w-12 h-12 text-xs rounded bg-slate-200 text-slate-400">
                              No image
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {property.masoqsdd}
                        </TableCell>
                        <TableCell>
                          {getPropertyTypeName(property.loaiid)}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {`${property.sonha}, ${property.tenduong}, ${property.phuong}, ${property.quan}, ${property.thanhpho}`}
                        </TableCell>
                        <TableCell>{property.dientich} m²</TableCell>
                        <TableCell>{formatPrice(property.dongia)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              property.tinhtrang,
                            )}`}
                          >
                            {getStatusText(property.tinhtrang)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Link to={`/properties/${property.bdsid}`}>
                              <Button variant="outline" size="sm">
                                Xem
                              </Button>
                            </Link>
                            <UpdatePropertyForm
                              propertyId={property.bdsid}
                              trigger={
                                <Button variant="outline" size="sm">
                                  Sửa
                                </Button>
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

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
