import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { register } from '@/api/User/user.client';
import { RouteNames } from '@/constants/routeNames';
import { useForm } from '@/hooks/useForm';
import { RegisterSchema } from '@/schemas/RegisterSchema';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

export const RegisterForm = () => {
  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success('Register successful!');
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
      console.log(values, formikHelpers);

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
              required
            />
            <Input
              id="lastname"
              type="text"
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              required
            />
            <Input
              id="email"
              type="text"
              name="email"
              label="Your email"
              placeholder="name@company.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              required
            />
            <Input
              id="password"
              type="password"
              name="password"
              label="Your password"
              placeholder="••••••••"
              className="placeholder:tracking-widest"
              value={formik.values.password}
              onChange={formik.handleChange}
              required
            />
            <Input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              label="Password Confirm"
              placeholder="••••••••"
              className="placeholder:tracking-widest"
              value={formik.values.passwordConfirm}
              onChange={formik.handleChange}
              required
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
