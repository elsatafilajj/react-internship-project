import { useMutation } from '@tanstack/react-query';
import {
  Home,
  FolderArchive,
  LogOut,
  PanelLeftClose,
  FolderInput,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { logout as apiLogout } from '@/api/User/user.client';
import { CreateEditRoomFormDialog } from '@/components/CreateEditRoomFormDialog';
import { ConfirmActionDialog } from '@/components/shared/ConfirmActionDialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RouteNames } from '@/constants/routeNames';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { useTourRefsContext } from '@/context/TourRefsContext/TourRefsContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { logout } = useAuthContext();

  const { myRoomsDashboardRef, archiveRef } = useTourRefsContext();

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
          <CreateEditRoomFormDialog />
          <div ref={myRoomsDashboardRef}>
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

          <div ref={archiveRef}>
            <Button
              variant="ghost"
              className="w-full justify-start font-medium"
              asChild
            >
              <Link to={RouteNames.ArchivedRooms}>
                <FolderArchive className="mr-2 h-4 w-4" />
                Archived
              </Link>
            </Button>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="flex items-center gap-2 p-2 justify-start"
                variant="ghost"
              >
                <FolderInput className="mr-2 h-4 w-4" />
                Export data
              </Button>
            </DialogTrigger>
            <form>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Choose your data file format</DialogTitle>
                  <DialogDescription>
                    Choose how you want to export your session data!
                  </DialogDescription>
                </DialogHeader>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="CSV" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>File Format</SelectLabel>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xml">XML</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" size="sm">
                    Download
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
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
