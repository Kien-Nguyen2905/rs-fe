import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeftIcon,
  PencilIcon,
  HomeIcon,
  MapPinIcon,
  BedDoubleIcon,
  BathIcon,
  RulerIcon,
  DollarSignIcon,
  BarChart,
  // DimensionsIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGetCustomerByIdQuery } from '@/queries/useCustomer';
import { useEstateByIdQuery } from '@/queries/useEstate';
import { realEstateStatus } from '@/constants/enums';

export function PropertyDetailPage() {
  const { id } = useParams();
  const [error, setError] = useState(null);

  const {
    data: response,
    isLoading: loading,
    error: queryError,
  } = useEstateByIdQuery(id);

  const property = response?.data;

  useEffect(() => {
    if (queryError) {
      setError('Failed to load property details. Please try again later.');
      console.error('Error fetching property details:', queryError);
    }
  }, [queryError]);

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
      case 1:
        return 'bg-green-100 text-green-800';
      case 2:
        return 'bg-orange-100 text-orange-800';
      case 3:
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

  if (loading) {
    return <div className="py-8 text-center">Loading property details...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  if (!property) {
    return <div className="py-8 text-center">Property not found</div>;
  }

  // Format the address
  const fullAddress = `${property.sonha}, ${property.tenduong}, ${property.phuong}, ${property.quan}, ${property.thanhpho}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link to="/properties">
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                property.tinhtrang,
              )}`}
            >
              {getStatusText(property.tinhtrang)}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Property ID: {property.bdsid}
          </h1>
          <div className="flex items-center text-muted-foreground">
            <MapPinIcon className="w-4 h-4 mr-1" />
            {fullAddress}
          </div>
        </div>
        {/* <Link to={`/properties/${id}/edit`}>
          <Button>
            <PencilIcon className="w-4 h-4 mr-2" /> Edit Property
          </Button>
        </Link> */}
      </div>

      {/* Main image */}
      <div className="relative overflow-hidden rounded-lg h-80">
        <img
          src={property.hinhanh}
          alt={property.mota}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Image gallery if available */}
      {property.dshinhanh && property.dshinhanh.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {property.dshinhanh.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Property image ${index + 1}`}
              className="object-cover w-full h-24 rounded"
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Property Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{property.mota || 'No description available.'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <HomeIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Property Type
                        </p>
                        <p className="font-medium">ID: {property.loaiid}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <RulerIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Area</p>
                        <p className="font-medium">{property.dientich} m²</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <HomeIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Dimensions
                        </p>
                        <p className="font-medium">
                          {property.chieudai} x {property.chieurong} m
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <BarChart className="w-5 h-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Commission Rate
                        </p>
                        <p className="font-medium">{property.huehong}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Legal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{property.masoqsdd}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Location Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 gap-2">
                    <li className="flex items-center">
                      <div className="w-2 h-2 mr-2 rounded-full bg-primary" />
                      <span className="font-medium">Address:</span>{' '}
                      {property.sonha}, {property.tenduong}
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 mr-2 rounded-full bg-primary" />
                      <span className="font-medium">Ward:</span>{' '}
                      {property.phuong}
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 mr-2 rounded-full bg-primary" />
                      <span className="font-medium">District:</span>{' '}
                      {property.quan}
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 mr-2 rounded-full bg-primary" />
                      <span className="font-medium">City:</span>{' '}
                      {property.thanhpho}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {formatPrice(property.dongia)}
              </p>
              <p className="mt-1 text-muted-foreground">
                {(property.dongia / property.dientich).toLocaleString('vi-VN')}{' '}
                VND/m²
              </p>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Khách hàng Information</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerInfo customerId={property.khid} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// New component to display customer information
function CustomerInfo({ customerId }) {
  const {
    data: customerData,
    isLoading,
    error,
  } = useGetCustomerByIdQuery(customerId);

  if (isLoading) {
    return <div className="my-4 text-sm">Loading customer information...</div>;
  }

  if (error) {
    return null;
  }

  if (!customerData || !customerData.data) {
    return null;
  }

  const customer = customerData.data;

  return (
    <div className="p-3 mt-4 border rounded-md bg-gray-50">
      <h3 className="mb-2 font-medium">Owner Information</h3>
      <div className="space-y-1 text-sm">
        <p>
          <span className="font-medium">Name:</span> {customer.hoten}
        </p>
        {customer.sodienthoai && (
          <p>
            <span className="font-medium">Phone:</span> {customer.sodienthoai}
          </p>
        )}
        {customer.email && (
          <p>
            <span className="font-medium">Email:</span> {customer.email}
          </p>
        )}
        {customer.diachi && (
          <p>
            <span className="font-medium">Address:</span> {customer.diachi}
          </p>
        )}
      </div>
    </div>
  );
}
