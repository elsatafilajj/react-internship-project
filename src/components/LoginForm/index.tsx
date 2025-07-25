import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import { login } from '@/api/User/user.client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RouteNames } from '@/constants/routeNames';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { capitalize } from '@/helpers/capitalize';
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { LoginSchema } from '@/schemas/LoginSchema';
import { ErrorResponseData } from '@/types/ErrorResponse';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthState } = useAuthContext();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success('Login successful!');
      setAuthState({
        user: data?.data?.user,
        accessToken: data?.data?.accessToken,
        refreshToken: data?.data?.refreshToken,
      });
      const redirectUrl = localStorage.getItem('redirectAfterLogin');

      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
      } else {
        navigate(RouteNames.Rooms);
      }
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

          formikHelpers.setFieldError('password', capitalizedError);
        }
      }
    },
  });

  return (
    <>
      <div className="flex items-center flex-col justify-center">
        <h1 className="text-3xl font-semibold leading-wide tracking-tight text-foreground md:text-4xl">
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
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          id="password"
          className="mb-2 placeholder:tracking-widest tracking-widest"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={getFormikError(formik, 'password')}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <div className="flex text-sm flex-col space-y-5 items-center justify-between">
          <Button
            type="submit"
            className="w-full"
            disabled={formik.isSubmitting}
          >
            Log In
          </Button>

          <Link
            to={RouteNames.ForgotPassword}
            className="font-medium text-foreground underline"
          >
            Forgot your password?
          </Link>

          <p className="text-foreground">
            Dont have an account?{' '}
            <Link
              to={RouteNames.Register}
              className="font-medium text-foreground underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};
