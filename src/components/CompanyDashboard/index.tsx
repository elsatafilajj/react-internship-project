import { useMutation } from '@tanstack/react-query';
import { Moon } from 'lucide-react';
import toast from 'react-hot-toast';

import { logout as apiLogout } from '@/api/User/user.client';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { useThemeContext } from '@/context/ThemeContext/ThemeContext';

import { Button } from '../ui/button';

export const CompanyDashboard = () => {
  const { user, logout } = useAuthContext();

  const { changeTheme } = useThemeContext();

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
      <Moon className="absolute right-0" onClick={changeTheme} />
      Company Dashboard {user?.firstName}
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};
