import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { OTPInput } from 'input-otp';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { verifyEmail } from '@/api/User/user.client';
import {
  SetVerifyEmailCode,
  SetVerifyEmailResponse,
} from '@/api/User/user.types';
import { Button } from '@/components/ui/button';
import { InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { RouteNames } from '@/constants/routeNames';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { useForm } from '@/hooks/useForm';
import { VerifyEmailSchema } from '@/schemas/VerifyEmailSchema';
import { ErrorResponseData } from '@/types/ErrorResponse';

export const VerifyEmailForm = () => {
  const [params] = useSearchParams();
  const email = params.get('email');
  const { setAuthState } = useAuthContext();
  const navigate = useNavigate();

  const verifyEmailMutation = useMutation<
    AxiosResponse<SetVerifyEmailResponse>,
    Error,
    { data: SetVerifyEmailCode; email: string }
  >({
    mutationFn: ({ data, email }) => verifyEmail(data, email),

    onSuccess: (data) => {
      const { user, accessToken, refreshToken } = data.data;

      setAuthState({
        user,
        accessToken,
        refreshToken,
      });

      toast.success('You are logged in!');
      navigate(RouteNames.Rooms);
    },

    onError: (error) => {
      const axiosError = error as AxiosError<ErrorResponseData>;

      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message as string;

      if (status === 404) {
        toast.success(message);
        navigate(RouteNames.Login);
      } else if (status === 422) {
        toast.error(message);
      } else {
        toast.error('Something went wrong. Please try again.');
        console.error(message);
      }
    },
  });

  const formikVerifyEmail = useForm({
    schema: VerifyEmailSchema,
    initialValues: {
      code: '',
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        await verifyEmailMutation.mutateAsync({
          data: {
            code: Number(values.code),
          },
          email: email || '',
        });

        formikHelpers.resetForm();
      } catch (error) {
        console.error('Verify email failed!', error);
      }
    },
  });
  return (
    <div className="flex flex-col items-center">
      <label className="mb-3 text-md font-medium" htmlFor="code">
        Enter Verification Code
      </label>
      <form onSubmit={formikVerifyEmail.handleSubmit} className="space-y-8">
        <OTPInput
          maxLength={6}
          id="code"
          name="code"
          type="code"
          value={formikVerifyEmail.values.code}
          onChange={(value) => formikVerifyEmail.setFieldValue('code', value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </OTPInput>
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};
