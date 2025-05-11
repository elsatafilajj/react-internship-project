import {
  Home,
  Star,
  FolderArchive,
  Settings,
  LogOut,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export const Sidebar = () => {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 p-4 flex flex-col justify-between text-sm">
      <nav className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start font-medium"
          asChild
        >
          <Link to="/sessions">
            <Home className="mr-2 h-4 w-4" />
            My Sessions
          </Link>
        </Button>

        <Button
          variant="default"
          className="w-full justify-start bg-primary hover:bg-[#28d49b] text-black font-medium"
          asChild
        >
          <Link to="/sessions/new">
            <Plus className="mr-2 h-4 w-4" />
            New Session
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

      <div>
        <Button
          variant="ghost"
          className="w-full justify-start font-medium"
          asChild
        >
          <Link to="/logout">
            <LogOut className="mr-2 h-4 w-4 " />
            Logout
          </Link>
        </Button>
      </div>
    </aside>
  );
};
