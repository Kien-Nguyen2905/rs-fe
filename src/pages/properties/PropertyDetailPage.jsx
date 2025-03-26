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
} from 'lucide-react';

export function PropertyDetailPage() {
  const { id } = useParams();

  const property = {
    id: parseInt(id),
    title: 'Luxury Villa',
    address: '123 Ocean Drive, Miami, FL',
    description:
      'A stunning oceanfront property with panoramic views and modern amenities throughout. This recently renovated villa features an open floor plan, high ceilings, and floor-to-ceiling windows that showcase the breathtaking ocean views. The property includes a private pool, garden, and direct beach access.',
    price: '$950,000',
    status: 'For Sale',
    bedrooms: 4,
    bathrooms: 3,
    area: '3,200 sq ft',
    yearBuilt: 2015,
    features: [
      'Swimming Pool',
      'Garden',
      'Garage',
      'Air Conditioning',
      'Ocean View',
      'Security System',
    ],
    images: ['villa1.jpg', 'villa2.jpg', 'villa3.jpg', 'villa4.jpg'],
  };

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
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                property.status === 'For Sale'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {property.status}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {property.title}
          </h1>
          <div className="flex items-center text-muted-foreground">
            <MapPinIcon className="w-4 h-4 mr-1" />
            {property.address}
          </div>
        </div>
        <Link to={`/properties/${id}/edit`}>
          <Button>
            <PencilIcon className="w-4 h-4 mr-2" /> Edit Property
          </Button>
        </Link>
      </div>

      {/* Mock image placeholder */}
      <div className="flex items-center justify-center bg-gray-200 rounded-lg h-80">
        <HomeIcon className="w-16 h-16 text-gray-400" />
        <p className="ml-4 text-gray-500">
          Property Image Gallery Would Go Here
        </p>
      </div>

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
                  <p>{property.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <BedDoubleIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Bedrooms
                        </p>
                        <p className="font-medium">{property.bedrooms}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <BathIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Bathrooms
                        </p>
                        <p className="font-medium">{property.bathrooms}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <RulerIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Area</p>
                        <p className="font-medium">{property.area}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <HomeIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Year Built
                        </p>
                        <p className="font-medium">{property.yearBuilt}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Features & Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 gap-2">
                    {property.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 mr-2 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
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
              <p className="text-3xl font-bold">{property.price}</p>
              <div className="mt-4 space-y-2">
                <Button className="w-full">Contact Agent</Button>
                <Button variant="outline" className="w-full">
                  Schedule Viewing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
