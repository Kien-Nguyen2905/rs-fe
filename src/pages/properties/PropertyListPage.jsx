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
import { PlusIcon, SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function PropertyListPage() {
  const properties = [
    {
      id: 1,
      title: 'Luxury Villa',
      address: '123 Ocean Drive',
      status: 'For Sale',
      price: '$950,000',
      bedrooms: 4,
      bathrooms: 3,
    },
    {
      id: 2,
      title: 'Modern Apartment',
      address: '456 Urban Ave',
      status: 'For Rent',
      price: '$2,800/mo',
      bedrooms: 2,
      bathrooms: 2,
    },
    {
      id: 3,
      title: 'Family Home',
      address: '789 Suburban Rd',
      status: 'For Sale',
      price: '$750,000',
      bedrooms: 3,
      bathrooms: 2,
    },
    {
      id: 4,
      title: 'Downtown Penthouse',
      address: '101 City Center',
      status: 'For Sale',
      price: '$1,500,000',
      bedrooms: 3,
      bathrooms: 3,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your real estate listings
          </p>
        </div>
        <Link to="/properties/create">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" /> Add Property
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <span>All Properties</span>
              <div className="relative w-64">
                <SearchIcon className="absolute w-4 h-4 left-2 top-3 text-muted-foreground" />
                <Input placeholder="Search properties..." className="pl-8" />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    {property.title}
                  </TableCell>
                  <TableCell>{property.address}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        property.status === 'For Sale'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {property.status}
                    </span>
                  </TableCell>
                  <TableCell>{property.price}</TableCell>
                  <TableCell>
                    {property.bedrooms} bed, {property.bathrooms} bath
                  </TableCell>
                  <TableCell className="space-x-1">
                    <Link to={`/properties/${property.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link to={`/properties/${property.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
