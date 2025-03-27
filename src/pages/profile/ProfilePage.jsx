import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { useAppContext } from '@/context/AppContext';
import {
  updateMeSchema,
  updateAdminSchema,
  changePasswordSchema,
} from '@/schemas/profileSchema';
import { toast } from 'react-toastify';
import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from '@/queries/useProfile';

export function ProfilePage() {
  const { user, setUser } = useAppContext();
  const isAdmin = user?.quyen === 0;

  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();

  // Personal Info Form
  const profileForm = useForm({
    resolver: zodResolver(isAdmin ? updateAdminSchema : updateMeSchema),
    defaultValues: {
      taikhoan: '',
      tennv: '',
      sdt: '',
      diachi: '',
      ngaysinh: '',
      gioitinh: 1,
      email: '',
      quyen: 0,
    },
  });

  // Password Form
  const passwordForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      matkhaucu: '',
      matkhaumoi: '',
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        taikhoan: user.taikhoan || '',
        tennv: user.tennv || '',
        sdt: user.sdt || '',
        diachi: user.diachi || '',
        ngaysinh:
          user.ngaysinh && !isNaN(new Date(user.ngaysinh).getTime())
            ? format(new Date(user.ngaysinh), 'yyyy-MM-dd')
            : '',
        gioitinh: user.gioitinh || 1,
        email: user.email || '',
        quyen: user.quyen || 0,
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (values) => {
    try {
      const response = await updateProfileMutation.mutateAsync(values);

      if (response && response.code === 200) {
        toast.success('Profile updated successfully');

        // Update user in context
        if (response.data) {
          setUser(response.data);
        }
      } else {
        toast.error(response?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    }
  };

  const onPasswordSubmit = async (values) => {
    try {
      // Check if new password matches confirm password
      if (values.matkhaumoi !== passwordForm.getValues().confirmPassword) {
        toast.error("New passwords don't match");
        return;
      }

      const response = await changePasswordMutation.mutateAsync(values);

      if (response && response.code === 200) {
        toast.success('Password updated successfully');
        passwordForm.reset();
      } else {
        toast.error(response?.message || 'Failed to update password');
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || 'Failed to update password',
      );
    }
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
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>

                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="tennv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="sdt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="diachi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="ngaysinh"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="gioitinh"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              defaultValue={String(field.value)}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">Male</SelectItem>
                                <SelectItem value="0">Female</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {isAdmin && (
                        <FormField
                          control={profileForm.control}
                          name="quyen"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <Select
                                onValueChange={(value) =>
                                  field.onChange(Number(value))
                                }
                                defaultValue={String(field.value)}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="0">Admin</SelectItem>
                                  <SelectItem value="1">Staff</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </CardContent>

                    <CardFooter>
                      <Button
                        type="submit"
                        disabled={
                          profileForm.formState.isSubmitting ||
                          updateProfileMutation.isPending
                        }
                      >
                        {profileForm.formState.isSubmitting ||
                        updateProfileMutation.isPending
                          ? 'Updating...'
                          : 'Save Changes'}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to enhance account security
                  </CardDescription>
                </CardHeader>

                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="matkhaucu"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="matkhaumoi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...passwordForm.register('confirmPassword')}
                          required
                        />
                        {passwordForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-destructive">
                            {
                              passwordForm.formState.errors.confirmPassword
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button
                        type="submit"
                        disabled={
                          passwordForm.formState.isSubmitting ||
                          changePasswordMutation.isPending
                        }
                      >
                        {passwordForm.formState.isSubmitting ||
                        changePasswordMutation.isPending
                          ? 'Updating...'
                          : 'Change Password'}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
