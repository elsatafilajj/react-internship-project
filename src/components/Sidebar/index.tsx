import { useMutation } from '@tanstack/react-query';
import { Home, FolderArchive, LogOut, PanelLeftClose } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';

import { logout as apiLogout } from '@/api/User/user.client';
import { useGetAllUsersByRoomQuery } from '@/api/User/user.query';
import { CreateEditRoomFormDialog } from '@/components/CreateEditRoomFormDialog';
import { TourLauncher } from '@/components/TourLauncher';
import { ConfirmActionDialog } from '@/components/shared/ConfirmActionDialog';
import { ThemeChangeToggle } from '@/components/shared/ThemeChangeToggle';
import { Button } from '@/components/ui/button';
import { RouteNames } from '@/constants/routeNames';
import { useAuthContext } from '@/context/AuthContext/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleSidebar: () => void;
}

export const Sidebar = ({ isOpen, onClose, onToggleSidebar }: SidebarProps) => {
  const { logout } = useAuthContext();

  const { roomId } = useParams<{ roomId: string }>();

  const { user } = useAuthContext();
  const { data: users } = useGetAllUsersByRoomQuery(roomId || '');

  const roomHost = users?.data?.find((user) => user.role === 'host');
  const isUserHost = roomHost?.uuid === user?.uuid;

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
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>

        <nav className="space-y-2 mt-8">
          {isUserHost && <CreateEditRoomFormDialog />}
          <div id="room">
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
          </div>

          <div id="archive">
            <Button
              variant="ghost"
              className="w-full justify-start font-medium"
              asChild
            >
              <Link to={RouteNames.ArchivedRooms}>
                <FolderArchive className="mr-2 h-4 w-4" />
                Archived Rooms
              </Link>
            </Button>
          </div>

          <ThemeChangeToggle />

          <TourLauncher onToggleSidebar={onToggleSidebar} />
        </nav>

        <div className="mt-auto flex justify-between cursor-pointer">
          <Button variant="ghost" className="justify-start font-medium" asChild>
            <div className="w-fit">
              <LogOut className="mr-2 h-4 w-4" />
              <ConfirmActionDialog
                className="max-w-fit cursor-pointer"
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
