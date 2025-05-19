import { TabsContent } from '@radix-ui/react-tabs';

import { ChangePasswordForm } from '@/components/ChangePasswordForm';
import { EditProfileForm } from '@/components/EditProfileForm';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Profile = () => {
  return (
    <div className="bg-card flex  flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
      <Tabs defaultValue="account" className="max-w-[400px] w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <EditProfileForm />
        </TabsContent>
        <TabsContent value="password">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};
