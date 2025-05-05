import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { logout } from '@/api/User/user.client';
import { useAuthContext } from '@/context/AuthContext/AuthContext';

import { Button } from '../ui/button';

export const CompanyDashboard = () => {
  const { user, logout: logoutHelper } = useAuthContext();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success('Logout successful!');
      logoutHelper();
    },
  });

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      console.error('Logout failed');
    }
  };

  return (
    <div>
      Company Dashboard {user?.firstName}
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};
