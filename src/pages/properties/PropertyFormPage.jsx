import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeftIcon } from 'lucide-react';

export function PropertyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    price: '',
    status: 'For Sale',
    bedrooms: '',
    bathrooms: '',
    area: '',
    yearBuilt: '',
    features: {
      'Swimming Pool': false,
      Garden: false,
      Garage: false,
      'Air Conditioning': false,
      'Ocean View': false,
      'Security System': false,
    },
  });

  useEffect(() => {
    if (isEditing) {
      const mockProperty = {
        title: 'Luxury Villa',
        description:
          'A stunning oceanfront property with panoramic views and modern amenities throughout.',
        address: '123 Ocean Drive, Miami, FL',
        price: '950000',
        status: 'For Sale',
        bedrooms: '4',
        bathrooms: '3',
        area: '3200',
        yearBuilt: '2015',
        features: {
          'Swimming Pool': true,
          Garden: true,
          Garage: true,
          'Air Conditioning': true,
          'Ocean View': true,
          'Security System': false,
        },
      };

      setFormData(mockProperty);
    }
  }, [isEditing, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Submitting property data:', formData);

    navigate('/properties');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/properties">
          <Button variant="ghost" size="sm">
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Properties
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? 'Edit Property' : 'Add New Property'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing
            ? 'Update property information'
            : 'Fill in the details for a new property listing'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter property title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="For Sale">For Sale</SelectItem>
                    <SelectItem value="For Rent">For Rent</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Rented">Rented</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter property address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="Number of bedrooms"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="Number of bathrooms"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area (sq ft)</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="Area in square feet"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input
                  id="yearBuilt"
                  name="yearBuilt"
                  type="number"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  placeholder="Year property was built"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the property"
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Features</Label>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(formData.features).map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={formData.features[feature]}
                      onCheckedChange={() => handleFeatureChange(feature)}
                    />
                    <label
                      htmlFor={feature}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/properties')}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Property' : 'Create Property'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
