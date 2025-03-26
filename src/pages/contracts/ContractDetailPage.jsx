import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeftIcon,
  PencilIcon,
  FileTextIcon,
  ClipboardIcon,
  CalendarIcon,
  DollarSignIcon,
} from 'lucide-react';

export function ContractDetailPage() {
  const { id } = useParams();

  const contract = {
    id: parseInt(id),
    property: {
      id: 1,
      title: 'Luxury Villa',
      address: '123 Ocean Drive, Miami, FL',
    },
    client: {
      id: 101,
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(555) 123-4567',
    },
    startDate: '2023-01-15',
    endDate: '2023-07-15',
    signedDate: '2023-01-10',
    value: '$150,000',
    status: 'Active',
    terms:
      'This contract is entered into by and between Real Estate Co. (Licensor) and John Doe (Licensee) for the property known as Luxury Villa located at 123 Ocean Drive, Miami, FL. The term of this lease shall begin on January 15, 2023 and end on July 15, 2023.',
    paymentSchedule: [
      { date: '2023-01-15', amount: '$25,000', status: 'Paid' },
      { date: '2023-02-15', amount: '$25,000', status: 'Paid' },
      { date: '2023-03-15', amount: '$25,000', status: 'Paid' },
      { date: '2023-04-15', amount: '$25,000', status: 'Paid' },
      { date: '2023-05-15', amount: '$25,000', status: 'Due' },
      { date: '2023-06-15', amount: '$25,000', status: 'Due' },
    ],
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link to="/contracts">
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                contract.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {contract.status}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Contract #{contract.id}
          </h1>
          <div className="flex items-center text-muted-foreground">
            <FileTextIcon className="w-4 h-4 mr-1" />
            For property: {contract.property.title}
          </div>
        </div>
        <Button>
          <PencilIcon className="w-4 h-4 mr-2" /> Edit Contract
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="terms">Terms</TabsTrigger>
              <TabsTrigger value="payments">Payment Schedule</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                        Property
                      </h3>
                      <p>{contract.property.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {contract.property.address}
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                        Client
                      </h3>
                      <p>{contract.client.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {contract.client.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {contract.client.phone}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-start">
                      <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Contract Period
                        </p>
                        <p className="font-medium">
                          {formatDate(contract.startDate)} -{' '}
                          {formatDate(contract.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <ClipboardIcon className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Signed Date
                        </p>
                        <p className="font-medium">
                          {formatDate(contract.signedDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DollarSignIcon className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Contract Value
                        </p>
                        <p className="font-medium">{contract.value}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{contract.terms}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contract.paymentSchedule.map((payment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between pb-2 border-b"
                      >
                        <div>
                          <div className="font-medium">Payment {index + 1}</div>
                          <div className="text-sm text-muted-foreground">
                            Due: {formatDate(payment.date)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{payment.amount}</div>
                          <div
                            className={`text-xs rounded-full px-2 py-1 inline-block ${
                              payment.status === 'Paid'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {payment.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">Download Contract</Button>
              <Button variant="outline" className="w-full">
                Send to Client
              </Button>
              <Button variant="outline" className="w-full">
                Record Payment
              </Button>
              {contract.status === 'Active' && (
                <Button variant="destructive" className="w-full">
                  Terminate Contract
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
