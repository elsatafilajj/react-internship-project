import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import { forgotPassword } from '@/api/User/user.client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RouteNames } from '@/constants/routeNames';
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { ForgotPasswordSchema } from '@/schemas/ForgotPasswordSchema';

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess() {
      toast.success('Password reset link sent to your email');
      navigate(RouteNames.Login);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const formik = useForm({
    schema: ForgotPasswordSchema,
    initialValues: {
      email: '',
    },
    onSubmit: async (values, formikHelpers) => {
      await forgotPasswordMutation.mutateAsync(values);

      formikHelpers.resetForm();
    },
  });

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-black mb-8">
        Reset Password
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email to continue"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={getFormikError(formik, 'email')}
        />

        <p className="text-sm text-center text-black ">
          Go back to{' '}
          <Link to={RouteNames.Login} className="font-medium underline">
            Login
          </Link>
        </p>

        <Button type="submit" disabled={formik.isSubmitting}>
          Forgot Password
        </Button>
      </form>
    </div>
  );
};
