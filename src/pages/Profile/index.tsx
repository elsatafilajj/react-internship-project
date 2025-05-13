import { ChangePasswordForm } from '@/components/ChangePasswordForm';
import { EditProfileForm } from '@/components/EditProfileForm';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Profile = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <EditProfileForm />
        <ChangePasswordForm />
      </Tabs>
    </div>
  );
};
