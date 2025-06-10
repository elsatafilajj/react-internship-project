import { useMutation } from '@tanstack/react-query';
import { OTPInput, REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

import { verifyEmail } from '@/api/User/user.client';
import { SetVerifyEmailCode } from '@/api/User/user.types';
import { Button } from '@/components/ui/button';
import { InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useForm } from '@/hooks/useForm';
import { VerifyEmailSchema } from '@/schemas/VerifyEmailSchema';

export const VerifyEmailForm = () => {
  const [params] = useSearchParams();
  const email = params.get('email');
  const verifyEmailMutation = useMutation({
    mutationFn: ({
      data,
      email,
    }: {
      data: SetVerifyEmailCode;
      email: string;
    }) => verifyEmail(data, email),
    onSuccess: () => {
      toast.success('You are logged in!');
    },
    onError: (error) => {
      toast.error(error.message);
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
          data: values,
          email: email || '',
        });
        formikHelpers.resetForm();
      } catch (error) {
        console.error('Reset Password failed!', error);
      }
    },
  });
  return (
    <div className="flex flex-col items-center">
      <label className="mb-3 text-md font-medium" htmlFor="verification-code">
        Enter Verification Code
      </label>
      <form onSubmit={formikVerifyEmail.handleSubmit} className="space-y-8">
        <OTPInput
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          id="verification-code"
          name="verification-code"
          type="code"
          value={formikVerifyEmail.values.code}
          onChange={formikVerifyEmail.handleChange}
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
