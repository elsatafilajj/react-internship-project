import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import { register } from '@/api/User/user.client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RouteNames } from '@/constants/routeNames';
import { capitalize } from '@/helpers/capitalize';
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { RegisterSchema } from '@/schemas/RegisterSchema';
import { ErrorResponseData } from '@/types/ErrorResponse';

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (_, variables) => {
      toast.success('Registered successfully!');
      navigate(`${RouteNames.VerifyEmail}?email=${variables.email}`);
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
        localStorage.removeItem('has-started-initial-tour');
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
            capitalizedError = capitalize(errorMessage.toString());
          }

          formikHelpers.setFieldError('passwordConfirm', capitalizedError);
        }
      }
    },
  });

  return (
    <>
      <div className="flex items-center flex-col justify-center">
        <h1 className="text-2xl font-semibold leading-wide tracking-tight text-foreground md:text-3xl">
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
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter your password"
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
        <Input
          id="passwordConfirm"
          type={showPasswordConfirm ? 'text' : 'password'}
          name="passwordConfirm"
          placeholder="Confirm your password"
          value={formik.values.passwordConfirm}
          onChange={formik.handleChange}
          error={getFormikError(formik, 'passwordConfirm')}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPasswordConfirm((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

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
