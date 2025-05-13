import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export const ChangePasswordForm = () => {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Change your password. After saving, you'll be logged out.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 mt-4">
        <Input
          name="oldPassword"
          type="password"
          placeholder="Enter your old password"
          id="oldPassword"
        />
        <Input
          name="password"
          type="password"
          placeholder="Enter your new password"
          id="password"
        />
        <Input
          name="passwordConfirm"
          type="password"
          placeholder="Confirm new password"
          id="passwordConfirm"
        />
      </CardContent>
      <CardFooter>
        <Button type="submit" className="mt-8">
          Save changes
        </Button>
      </CardFooter>
    </Card>
  );
};
