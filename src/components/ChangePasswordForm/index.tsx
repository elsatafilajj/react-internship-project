import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { changePassword } from '@/api/User/user.client';
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
import { ChangePasswordSchema } from '@/schemas/ChangePasswordSchema';
import { ErrorResponseData } from '@/types/ErrorResponse';

export const ChangePasswordForm = () => {
  const { logout } = useAuthContext();
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password has changed!');
      logout();
    },
  });

  const formik = useForm({
    schema: ChangePasswordSchema,
    initialValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        await changePasswordMutation.mutateAsync(values);
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

          formikHelpers.setFieldError('newPasswordConfirm', capitalizedError);
        }
      }
    },
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Change your password. After saving, you'll be logged out.
        </CardDescription>
      </CardHeader>

      <form onSubmit={formik.handleSubmit} className="space-y-2">
        <CardContent className="space-y-4 mt-4">
          <Input
            name="oldPassword"
            type="password"
            placeholder="Enter your old password"
            id="oldPassword"
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            error={getFormikError(formik, 'oldPassword')}
          />
          <Input
            name="newPassword"
            type="password"
            placeholder="Enter your new password"
            id="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            error={getFormikError(formik, 'newPassword')}
          />
          <Input
            name="newPasswordConfirm"
            type="password"
            placeholder="Confirm new password"
            id="newPasswordConfirm"
            value={formik.values.newPasswordConfirm}
            onChange={formik.handleChange}
            error={getFormikError(formik, 'newPasswordConfirm')}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="mt-8" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
