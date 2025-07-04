import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { editProfile, getUserDetails } from '@/api/User/user.client';
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
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { capitalize } from '@/helpers/capitalize';
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { EditProfileSchema } from '@/schemas/EditProfileSchema';
import { ErrorResponseData } from '@/types/ErrorResponse';

export const EditProfileForm = () => {
  const { user, setAuthState } = useAuthContext();
  const navigate = useNavigate();

  const editProfileMutation = useMutation({
    mutationFn: editProfile,
    onSuccess: async () => {
      const updatedUser = await getUserDetails();
      setAuthState({ user: updatedUser?.data });
      toast.success('Your profile has been updated!');
    },
  });

  const formikProfile = useForm({
    schema: EditProfileSchema,
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email,
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        delete values.email;

        await editProfileMutation.mutateAsync(values);
        formikHelpers.resetForm();
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message as AxiosError<
            ErrorResponseData['message']
          >;

          let capitalizedError;
          if (Array.isArray(errorMessage)) {
            capitalizedError = capitalize(errorMessage[0]);
          } else {
            capitalizedError = capitalize(errorMessage.toLocaleString());
          }

          formikHelpers.setFieldError('email', capitalizedError);
        }
      }
    },
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-20 w-20 border-2 border-primary">
          <AvatarImage src="/placeholder-user.jpg" alt="Profile Picture" />
          <AvatarFallback className="capitalize">
            {user?.firstName[0]}
            {user?.lastName[0]}
          </AvatarFallback>
        </Avatar>
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
          <Button
            type="submit"
            className="mt-8 "
            disabled={formikProfile.isSubmitting}
          >
            {formikProfile.isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </CardFooter>
      </form>
      <button
        onClick={() => navigate(-1)}
        className="text-sm cursor-pointer transform hover:scale-105 transition-transform"
      >
        Go back
      </button>
    </Card>
  );
};
