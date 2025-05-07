import { useMutation } from '@tanstack/react-query';
import { CircleCheck } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useSearchParams } from 'react-router-dom';

import { resetPassword } from '@/api/User/user.client';
import { SetPasswordInput } from '@/api/User/user.types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RouteNames } from '@/constants/routeNames';
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { ResetPasswordSchema } from '@/schemas/ResetPasswordSchema';

const ResetPasswordForm = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const firstName = params.get('firstName');
  const [messageSent, setMessageSent] = useState(false);

  const resetPasswordMutation = useMutation({
    mutationFn: ({ data, token }: { data: SetPasswordInput; token: string }) =>
      resetPassword(data, token),
    onSuccess: () => {
      setMessageSent(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formikPassword = useForm({
    schema: ResetPasswordSchema,
    initialValues: {
      password: '',
      passwordConfirm: '',
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        if (!token) {
          toast.error('Invalid or missing token!');
          return;
        }

        await resetPasswordMutation.mutateAsync({
          data: values,
          token: token,
        });
        formikHelpers.resetForm();
      } catch (error) {
        console.error('Reset Password failed!', error);
      }
    },
  });

  return (
    <div>
      {messageSent ? (
        <div>
          <Alert>
            <AlertTitle>
              <CircleCheck />
            </AlertTitle>
            <AlertTitle>Password reset</AlertTitle>
            <AlertDescription>
              <Link
                to={RouteNames.Login}
                className="flex items-center gap-1 hover:underline"
              >
                Login now
                <ChevronRight size={16} />
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <>
          <p className="text-[18px] ">Hello, {firstName}</p>
          <p className="text-[14px] text-stone-400">
            A request has been made to reset your password. If you made this
            request, now u can reset your password{' '}
          </p>
          <form
            onSubmit={formikPassword.handleSubmit}
            className="space-y-8 mt-4"
          >
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="New Password"
              error={getFormikError(formikPassword, 'password')}
              value={formikPassword.values.password}
              onChange={formikPassword.handleChange}
            />
            <Input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="Confirm Password"
              error={getFormikError(formikPassword, 'passwordConfirm')}
              value={formikPassword.values.passwordConfirm}
              onChange={formikPassword.handleChange}
            />
            <Button type="submit">Reset password</Button>
          </form>
        </>
      )}
    </div>
  );
};

export default ResetPasswordForm;
