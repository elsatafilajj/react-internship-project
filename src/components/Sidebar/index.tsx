import {
  Home,
  Star,
  FolderArchive,
  Settings,
  LogOut,
  Plus,
  PanelLeftClose,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { RouteNames } from '@/constants/routeNames';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-200 p-4 flex flex-col text-sm z-50 transition-transform duration-300 transform ${
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

          <Button
            variant="default"
            className="w-full justify-start bg-primary hover:bg-[#28d49b] text-black font-medium"
            asChild
          >
            <Link to="/rooms/new">
              <Plus className="mr-2 h-4 w-4" />
              New Room
            </Link>
          </Button>

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

        <div className="mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start font-medium"
            asChild
          >
            <Link to="/logout">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Link>
          </Button>
        </div>
      </aside>
    </>
  );
};
