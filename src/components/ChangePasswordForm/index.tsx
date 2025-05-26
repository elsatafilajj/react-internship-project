import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { queryKeys } from '@/constants/queryKeys';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { ChangePasswordSchema } from '@/schemas/ChangePasswordSchema';

interface ChangePasswordFormProps {
  id: string;
}

export const ChangePasswordForm = ({ id }: ChangePasswordFormProps) => {
  const { logout } = useAuthContext();
  const queryClient = useQueryClient();

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.getSingleUser(id) });
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
      } catch {
        console.error('Change password failed');
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
