import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import { forgotPassword } from '@/api/User/user.client';
import { InputField } from '@/components/shared/InputField';
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
    <div className="login-page__container">
      <h2 className="login-page__title">Reset Password</h2>
      <p className="login-page__subtitle">Enter email to continue</p>

      <form onSubmit={formik.handleSubmit}>
        <InputField
          id="email"
          name="email"
          label="Email"
          className="mb-4"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={getFormikError(formik, 'email')}
        />

        <Link to={RouteNames.Login} className="login-page__forgot-password">
          Return to Login
        </Link>

        <button
          type="submit"
          className="login-page__login-btn"
          disabled={formik.isSubmitting}
        >
          Forgot Password
        </button>
      </form>

      <p className="login-page__copyright-text">
        © {new Date().getFullYear()} DoSA Safety Enhancements Inc TM
      </p>
    </div>
  );
};
