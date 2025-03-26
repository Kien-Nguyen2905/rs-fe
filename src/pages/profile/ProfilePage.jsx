import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  UserIcon,
  LockIcon,
  ShieldIcon,
  MapPinIcon,
  CalendarIcon,
  PhoneIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { useAppContext } from '@/context/AppContext';

export function ProfilePage() {
  const { user } = useAppContext();

  const [personalInfo, setPersonalInfo] = useState({
    tennv: '',
    email: '',
    sdt: '',
    diachi: '',
    ngaysinh: '',
    role: '',
  });

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        tennv: user.tennv || '',
        email: user.email || '',
        sdt: user.sdt || '',
        diachi: user.diachi || '',
        ngaysinh:
          user?.ngaysinh && !isNaN(new Date(user.ngaysinh).getTime())
            ? format(new Date(user.ngaysinh), 'yyyy-MM-dd')
            : '',
        role: user.quyen === 0 ? 'Admin' : 'Staff',
      });
    }
  }, [user]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updatePersonalInfo = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: '', text: '' });
    setTimeout(() => {
      setMessage({
        type: 'success',
        text: 'Profile updated successfully',
      });
      setIsUpdating(false);
    }, 1000);
  };

  const updatePassword = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      setMessage({
        type: 'error',
        text: "New passwords don't match",
      });
      setIsUpdating(false);
      return;
    }

    // TODO: Implement actual password update API call
    setTimeout(() => {
      setMessage({
        type: 'success',
        text: 'Password updated successfully',
      });
      setPasswordInfo({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <Card className="w-full md:w-80 h-fit">
          <CardHeader>
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src="" alt={user?.tennv} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user?.tennv
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{user?.tennv}</CardTitle>
              <CardDescription>
                {user?.quyen === 0 ? 'Admin' : 'Staff'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>{user?.sdt}</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>{user?.diachi}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>
                  {user?.ngaysinh && !isNaN(new Date(user.ngaysinh).getTime())
                    ? format(new Date(user.ngaysinh), 'dd/MM/yyyy')
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center">
                <ShieldIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>{user?.quyen === 0 ? 'Admin' : 'Staff'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          <Tabs defaultValue="personal">
            <TabsList>
              <TabsTrigger value="personal">
                <UserIcon className="w-4 h-4 mr-2" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="security">
                <LockIcon className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <form onSubmit={updatePersonalInfo}>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {message.text && message.type === 'success' && (
                      <div className="p-3 text-sm text-green-600 border border-green-200 rounded-md bg-green-50">
                        {message.text}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="tennv">Full Name</Label>
                      <Input
                        id="tennv"
                        name="tennv"
                        value={personalInfo.tennv}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sdt">Phone Number</Label>
                      <Input
                        id="sdt"
                        name="sdt"
                        value={personalInfo.sdt}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="diachi">Address</Label>
                      <Input
                        id="diachi"
                        name="diachi"
                        value={personalInfo.diachi}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ngaysinh">Date of Birth</Label>
                      <Input
                        id="ngaysinh"
                        name="ngaysinh"
                        type="date"
                        value={personalInfo.ngaysinh}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        disabled={user?.quyen !== 0}
                        name="role"
                        value={personalInfo.role}
                        onValueChange={(value) =>
                          setPersonalInfo((prev) => ({ ...prev, role: value }))
                        }
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {user?.quyen !== 0
                          ? 'Your role cannot be changed. Contact an administrator for role changes.'
                          : 'You can change roles as an administrator.'}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? 'Updating...' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <form onSubmit={updatePassword}>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to enhance account security
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {message.text && (
                      <div
                        className={`p-3 text-sm rounded-md ${
                          message.type === 'error'
                            ? 'bg-red-50 border border-red-200 text-red-600'
                            : 'bg-green-50 border border-green-200 text-green-600'
                        }`}
                      >
                        {message.text}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordInfo.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordInfo.newPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordInfo.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? 'Updating...' : 'Change Password'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
