import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { logout as apiLogout } from '@/api/User/user.client';
import { ThemeChangeToggle } from '@/components/shared/ThemeChangeToggle';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext/AuthContext';

export const CompanyDashboard = () => {
  const { user, logout } = useAuthContext();

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      toast.success('Logout successful!');
      logout();
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
      <ThemeChangeToggle />
      Company Dashboard {user?.firstName}
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};
