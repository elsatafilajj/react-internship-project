import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { login } from '@/api/User/user.client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <>
      <div className="flex items-center flex-col justify-center">
        <h1 className="text-3xl font-semibold leading-wide tracking-tight text-black md:text-4xl">
          Log in
        </h1>
      </div>

      <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
        <Input
          name="email"
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={getFormikError(formik, 'email')}
        />
        <Input
          name="password"
          type="password"
          placeholder="••••••••"
          id="password"
          className="mb-2 placeholder:tracking-widest"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={getFormikError(formik, 'password')}
        />
        <div className="flex text-xs flex-col space-y-5 items-center justify-between">
          <Link
            to={RouteNames.ForgotPassword}
            className="font-medium text-primary underline"
          >
            Forgot your password?
          </Link>
          <Button
            type="submit"
            className="w-full"
            disabled={formik.isSubmitting}
          >
            Log In
          </Button>
          <p>
            Dont have an account?{' '}
            <Link
              to={RouteNames.Register}
              className=" font-medium text-primary underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};
