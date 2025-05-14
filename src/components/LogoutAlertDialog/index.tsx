import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { logout as apiLogout } from '@/api/User/user.client';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext/AuthContext';

export const LogoutAlertDialog = () => {
  const { logout } = useAuthContext();

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      toast.success('Logout successful!');
      logout();
    },
    onError: () => {
      toast.error('Logout failed');
    },
  });

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>Logout</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white w-[100px] border hover:bg-gray-100">
            Cancel
          </AlertDialogCancel>
          <Button onClick={handleLogout} className="w-[100px]">
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
