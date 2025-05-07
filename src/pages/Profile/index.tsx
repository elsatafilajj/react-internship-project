import { useMutation } from '@tanstack/react-query';
import { UploadIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { editProfile } from '@/api/User/user.client';
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
import { EditProfileSchema } from '@/schemas/EditProfileSchema';

export const Profile = () => {
  const { user } = useAuthContext();

  const editProfileMutation = useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      toast.success('Your profile has been updated!');
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
                <AvatarFallback>{user?.firstName[0]}</AvatarFallback>
              </Avatar>
              <Button
                className="max-w-[150px] bg-transparent hover:bg-transparent border hover:border-primary"
                size="sm"
              >
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
                  disabled
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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
