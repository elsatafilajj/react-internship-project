import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { register } from '@/api/User/user.client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RouteNames } from '@/constants/routeNames';
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { RegisterSchema } from '@/schemas/RegisterSchema';

export const RegisterForm = () => {
  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success('Registered successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
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

      formikHelpers.resetForm();
    },
  });

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
      <div className="max-w-[450px] w-full rounded-2xl shadow dark:border md:mt-0  xl:p-0">
        <div className="p-6 space-y-6 md:space-y-10 sm:p-8 bg-white  rounded-2xl flex flex-col">
          <a
            href="#"
            className="flex items-center justify-center text-2xl font-semibold text-green-900"
          >
            <img className="h-8 mr-2" src="/logo-full.svg" alt="logo" />
          </a>
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-black mb-8">
            Create an account
          </h1>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Input
              id="firstname"
              type="text"
              name="firstName"
              label="First Name"
              placeholder="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={getFormikError(formik, 'firstName')}
            />
            <Input
              id="lastname"
              type="text"
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={getFormikError(formik, 'lastName')}
            />
            <Input
              id="email"
              type="text"
              name="email"
              label="Your email"
              placeholder="name@company.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={getFormikError(formik, 'email')}
            />
            <Input
              id="password"
              type="password"
              name="password"
              label="Your password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={getFormikError(formik, 'password')}
            />
            <Input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              label="Password Confirm"
              placeholder="Confirm your password"
              value={formik.values.passwordConfirm}
              onChange={formik.handleChange}
              error={getFormikError(formik, 'passwordConfirm')}
            />
            <div className="flex text-xs  flex-col space-y-5 items-center justify-between">
              <div className="text-sm text-black text-center">
                Already have an account?{' '}
                <Link
                  to={RouteNames.Login}
                  className="font-medium text-primary underline"
                >
                  Log in
                </Link>
              </div>
              <Button type="submit">Create an account</Button>
              <p className="text-xs text-center text-gray-500">
                © {new Date().getFullYear()} Stuck ™
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
