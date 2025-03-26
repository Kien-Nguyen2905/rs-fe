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

export function ContractListPage() {
  const contracts = [
    {
      id: 10001,
      property: 'Luxury Villa',
      client: 'John Doe',
      startDate: '2023-01-15',
      endDate: '2023-07-15',
      value: '$150,000',
      status: 'Active',
    },
    {
      id: 10002,
      property: 'Modern Apartment',
      client: 'Jane Smith',
      startDate: '2022-11-01',
      endDate: '2023-10-31',
      value: '$45,600',
      status: 'Active',
    },
    {
      id: 10003,
      property: 'Family Home',
      client: 'Robert Johnson',
      startDate: '2023-02-10',
      endDate: '2023-02-10',
      value: '$750,000',
      status: 'Completed',
    },
    {
      id: 10004,
      property: 'Downtown Penthouse',
      client: 'Sarah Williams',
      startDate: '2023-03-01',
      endDate: '2023-09-01',
      value: '$72,000',
      status: 'Active',
    },
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
          <p className="text-muted-foreground">
            Manage property contracts and agreements
          </p>
        </div>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" /> New Contract
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <span>All Contracts</span>
              <div className="relative w-64">
                <SearchIcon className="absolute w-4 h-4 left-2 top-3 text-muted-foreground" />
                <Input placeholder="Search contracts..." className="pl-8" />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract #</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.id}</TableCell>
                  <TableCell>{contract.property}</TableCell>
                  <TableCell>{contract.client}</TableCell>
                  <TableCell>{formatDate(contract.startDate)}</TableCell>
                  <TableCell>{formatDate(contract.endDate)}</TableCell>
                  <TableCell>{contract.value}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contract.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {contract.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link to={`/contracts/${contract.id}`}>
                      <Button variant="ghost" size="sm">
                        View
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
