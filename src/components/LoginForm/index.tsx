import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { login } from '@/api/User/user.client';
import { RouteNames } from '@/constants/routeNames';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { useForm } from '@/hooks/useForm';
import { LoginSchema } from '@/schemas/LoginSchema';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

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
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
      <div className="max-w-[470px] w-full rounded-2xl shadow dark:border md:mt-0  xl:p-0">
        <div className="p-6 space-y-4 md:space-y-10 sm:p-8 bg-white  rounded-2xl flex flex-col">
          <div className="flex items-center flex-col justify-center">
            <a
              href="#"
              className="flex items-center mb-6 text-5xl font-semibold text-gray-900 dark:text-white"
            >
              <img
                className="w-auto h-8 mr-2"
                src="/logo-full.svg"
                alt="logo"
              />
            </a>

            <h1 className="text-3xl font-semibold leading-wide tracking-tight text-black md:text-4xl">
              Log in
            </h1>
          </div>

          <form
            className="space-y-4 md:space-y-6"
            onSubmit={formik.handleSubmit}
          >
            <Input
              id="email"
              type="email"
              name="email"
              // label="Your email"
              placeholder="name@company.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              required
            />
            <Input
              name="password"
              // label="Your password"
              type="password"
              placeholder="••••••••"
              id="password"
              className="mb-2 placeholder:tracking-widest"
              value={formik.values.password}
              onChange={formik.handleChange}
              required
            />{' '}
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

          <p className="text-center text-xs text-black">
            © {new Date().getFullYear()} Stuck ™
          </p>
        </div>
      </div>
    </div>
    // </section>
  );
};
