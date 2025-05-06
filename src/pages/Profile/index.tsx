import { useMutation } from '@tanstack/react-query';
import { UploadIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { editProfile, resetPassword } from '@/api/User/user.client';
import { SetPasswordInput } from '@/api/User/user.types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { ChangePasswordSchema } from '@/schemas/ChangePasswordSchema';
import { EditProfileSchema } from '@/schemas/EditProfileSchema';

export const Profile = () => {
  const { user } = useAuthContext();
  const token = localStorage.getItem('token');

  const editProfileMutation = useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      toast.success('Your profile has been updated!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ data, token }: { data: SetPasswordInput; token: string }) =>
      resetPassword(data, token),
    onSuccess: () => {
      toast.success('Your password has been updated!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formikProfile = useForm({
    schema: EditProfileSchema,
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        await editProfileMutation.mutateAsync(values);
        formikHelpers.resetForm();
      } catch (error) {
        console.error('Edit Profile failed!', error);
      }
    },
  });

  const formikPassword = useForm({
    schema: ChangePasswordSchema,
    initialValues: {
      oldPassword: '',
      password: '',
      passwordConfirm: '',
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        await resetPasswordMutation.mutateAsync({
          data: values,
          token: token ?? '',
        });
        formikHelpers.resetForm();
      } catch (error) {
        console.error('Edit Password failed!', error);
      }
    },
  });

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage
                  src="/placeholder-user.jpg"
                  alt="Profile Picture"
                />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <UploadIcon className="mr-2 h-4 w-4" />
                Change Photo
              </Button>
            </div>

            <form onSubmit={formikProfile.handleSubmit}>
              <CardContent className="space-y-4">
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={formikProfile.values.firstName}
                  onChange={formikProfile.handleChange}
                  error={getFormikError(formikProfile, 'firstName')}
                  onBlur={formikProfile.handleBlur}
                />
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={formikProfile.values.lastName}
                  onChange={formikProfile.handleChange}
                  error={getFormikError(formikProfile, 'lastName')}
                  onBlur={formikProfile.handleBlur}
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formikProfile.values.email}
                  error={getFormikError(formikProfile, 'email')}
                  onChange={formikProfile.handleChange}
                  onBlur={formikProfile.handleBlur}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="mt-8">
                  {editProfileMutation.isPending ? 'Saving...' : 'Save changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Change your password. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <form onSubmit={formikPassword.handleSubmit}>
              <CardContent className="space-y-4">
                <Input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  placeholder="Old Password"
                  error={getFormikError(formikPassword, 'oldPassword')}
                  value={formikPassword.values.oldPassword}
                  onChange={formikPassword.handleChange}
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="New Password"
                  value={formikPassword.values.password}
                  onChange={formikPassword.handleChange}
                  error={getFormikError(formikPassword, 'password')}
                />
                <Input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  placeholder="Confirm Password"
                  value={formikPassword.values.passwordConfirm}
                  onChange={formikPassword.handleChange}
                  error={getFormikError(formikPassword, 'passwordConfirm')}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="mt-6">
                  Save password
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
