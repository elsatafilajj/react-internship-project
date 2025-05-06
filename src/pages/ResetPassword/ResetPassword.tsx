import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { resetPassword } from '@/api/User/user.client';
import { SetPasswordInput } from '@/api/User/user.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FormValues {
  new_password: string;
  confirm_password: string;
}

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // assumes route is /reset-password/:token

  const mutation = useMutation({
    mutationFn: (data: SetPasswordInput) => {
      if (!token) throw new Error('Reset token is missing');
      return resetPassword(data, token);
    },
    onSuccess: () => {
      toast('success');
      navigate('/profile');
    },
    onError: () => {
      toast('error');
    },
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      new_password: '',
      confirm_password: '',
    },
    onSubmit: (values) => {
      if (values.new_password !== values.confirm_password) {
        toast('do not match');
        return;
      }
      mutation.mutate({
        new_password: values.new_password,
        confirm_password: values.confirm_password,
      });
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Reset Password
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <Input
              type="password"
              name="new_password"
              onChange={formik.handleChange}
              value={formik.values.new_password}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <Input
              type="password"
              name="confirm_password"
              onChange={formik.handleChange}
              value={formik.values.confirm_password}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
};
