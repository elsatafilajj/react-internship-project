import { useMutation } from '@tanstack/react-query';
import {
  Home,
  Star,
  FolderArchive,
  Settings,
  LogOut,
  PanelLeftClose,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { logout as apiLogout } from '@/api/User/user.client';
import { CreateEditRoomFormDialog } from '@/components/CreateEditRoomFormDialog';
import { ConfirmActionDialog } from '@/components/shared/ConfirmActionDialog';
import { Button } from '@/components/ui/button';
import { RouteNames } from '@/constants/routeNames';
import { useAuthContext } from '@/context/AuthContext/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
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
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-card border-r p-4 flex flex-col text-sm z-50 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button onClick={onClose} className="absolute top-3 right-3">
          <PanelLeftClose className="h-4 w-4" />
        </button>

        <nav className="space-y-2 flex-1 mt-4">
          <Button
            variant="ghost"
            className="w-full justify-start font-medium"
            asChild
          >
            <Link to={RouteNames.Rooms}>
              <Home className="mr-2 h-4 w-4" />
              My Rooms
            </Link>
          </Button>

          <CreateEditRoomFormDialog />

          <Button
            variant="ghost"
            className="w-full justify-start font-medium"
            asChild
          >
            <Link to="/favorites">
              <Star className="mr-2 h-4 w-4" />
              Favorites
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start font-medium"
            asChild
          >
            <Link to="/archived">
              <FolderArchive className="mr-2 h-4 w-4" />
              Archived
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start font-medium"
            asChild
          >
            <Link to="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </nav>

        <div className="mt-auto flex justify-between">
          <Button
            variant="ghost"
            className=" justify-start font-medium"
            asChild
          >
            <div className="w-fit">
              <LogOut className="mr-2 h-4 w-4" />
              <ConfirmActionDialog
                className="max-w-fit"
                triggerButtonName="Logout"
                title="Are you sure you want to logout?"
                onConfirm={handleLogout}
              />
            </div>
          </Button>
        </div>
      </aside>
    </>
  );
};
