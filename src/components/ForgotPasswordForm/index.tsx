import { useMutation } from '@tanstack/react-query';
import { CircleCheck } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import { forgotPassword } from '@/api/User/user.client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RouteNames } from '@/constants/routeNames';
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { ForgotPasswordSchema } from '@/schemas/ForgotPasswordSchema';

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [messageSent, setMessageSent] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setMessageSent(true);
      setTimeout(() => {
        navigate(RouteNames.Login);
      }, 10000);
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
    <>
      {messageSent ? (
        <div>
          <Alert>
            <AlertTitle>
              <CircleCheck />
            </AlertTitle>
            <AlertTitle>Email sent</AlertTitle>
            <AlertDescription>
              Check yout email and open the link we sent to continue
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div>
          <h2 className="text-[16px] text-black mb-8">
            Enter you email and we'll send you a link to reset your password
          </h2>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email to continue"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={getFormikError(formik, 'email')}
            />

            <p className="text-sm text-center text-black ">
              Go back to{' '}
              <Link to={RouteNames.Login} className="font-medium underline">
                Login
              </Link>
            </p>

            <Button type="submit" disabled={formik.isSubmitting}>
              Send link to email
            </Button>
          </form>
        </div>
      )}
    </>
  );
};
