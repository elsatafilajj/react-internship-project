import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import { register } from '@/api/User/user.client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RouteNames } from '@/constants/routeNames';
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { RegisterSchema } from '@/schemas/RegisterSchema';
import { ErrorResponseData } from '@/types/ErrorResponse';

export const RegisterForm = () => {
  const [backEndError, setBackendError] = useState('');

  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success('Registered successfully!');
      navigate('/login');
    },
    onError: async (error: AxiosError) => {
      const responseData = error.response?.data as ErrorResponseData;
      setBackendError(responseData.message);
      if (Array.isArray(backEndError)) {
        toast.error(
          backEndError[0][0].toUpperCase() + backEndError[0].slice(1) ||
            'Signup failed',
        );
      }
      if (typeof backEndError === 'string') {
        toast.error(
          backEndError[0].toUpperCase() + backEndError.slice(1) ||
            'Signup failed',
        );
      }
    },
  });

  const formik = useForm({
    schema: RegisterSchema,
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        await registerMutation.mutateAsync(values);
        formikHelpers.resetForm();
      } catch {
        console.error('Register failed! ');
      }
    },
  });

  return (
    <>
      <div className="flex items-center flex-col justify-center">
        <h1 className="text-3xl font-semibold leading-wide tracking-tight text-foreground md:text-4xl">
          Create an account
        </h1>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Input
          id="firstname"
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          error={getFormikError(formik, 'firstName')}
        />
        <Input
          id="lastname"
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          error={getFormikError(formik, 'lastName')}
        />
        <Input
          id="email"
          type="text"
          name="email"
          placeholder="Enter your email address"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={getFormikError(formik, 'email')}
        />
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={getFormikError(formik, 'password')}
        />
        <Input
          id="passwordConfirm"
          type="password"
          name="passwordConfirm"
          placeholder="Confirm your password"
          value={formik.values.passwordConfirm}
          onChange={formik.handleChange}
          error={getFormikError(formik, 'passwordConfirm')}
        />

        {backEndError && typeof backEndError === 'string' && (
          <p className="text-sm text-destructive">{backEndError}</p>
        )}

        {backEndError && Array.isArray(backEndError) && (
          <div className="flex flex-col gap-1">
            {backEndError.map((messageItem) => (
              <p className="text-sm text-destructive ">
                {messageItem[0].toUpperCase() + messageItem.slice(1)}
              </p>
            ))}
          </div>
        )}

        <div className="flex text-xs  flex-col space-y-5 items-center justify-between">
          <div className="text-sm text-foreground text-center">
            Already have an account?{' '}
            <Link to={RouteNames.Login} className="font-medium  underline">
              Log in
            </Link>
          </div>
          <Button type="submit">Create an account</Button>
        </div>
      </form>
    </>
  );
};
