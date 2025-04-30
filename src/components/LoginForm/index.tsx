import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { login } from '@/api/User/user.client';
import { InputField } from '@/components/shared/InputField';
import { RouteNames } from '@/constants/routeNames';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { LoginSchema } from '@/schemas/LoginSchema';

export const LoginForm = () => {
  const { setUser } = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success('Login successful!');
      setUser({ user: data.data.user, token: data.data.accessToken });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formik = useForm({
    schema: LoginSchema,
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        await loginMutation.mutateAsync(values);
        formikHelpers.resetForm();
      } catch {
        console.error('Login failed');
      }
    },
  });

  return (
    <div className="login-page__container">
      <h2 className="login-page__title">Welcome</h2>
      <p className="login-page__subtitle">Login to continue</p>

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

        <InputField
          id="password"
          name="password"
          label="Password"
          className="mb-2"
          value={formik.values.password}
          type="password"
          onChange={formik.handleChange}
          error={getFormikError(formik, 'password')}
        />

        <Link
          to={RouteNames.ForgotPassword}
          className="login-page__forgot-password"
        >
          Forgot your password?
        </Link>

        <button
          type="submit"
          className="login-page__login-btn"
          disabled={formik.isSubmitting}
        >
          Log In
        </button>
      </form>

      <p className="login-page__copyright-text">
        © {new Date().getFullYear()} DoSA Safety Enhancements Inc TM
      </p>
    </div>
  );
};
