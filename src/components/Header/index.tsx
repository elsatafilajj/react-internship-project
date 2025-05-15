import { Bell, ChevronDown, PanelLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import logoImg from '@/assets/images/logo-full.svg';
import logoIcon from '@/assets/images/logo-small.svg';
import { LogoutAlertDialog } from '@/components/LogoutAlertDialog';
import { ShareLinkAlertDialog } from '@/components/ShareLinkAlertDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useAuthContext } from '@/context/AuthContext/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { user } = useAuthContext();
  const participants = [{ name: 'Ben' }, { name: 'Alice' }, { name: 'Elara' }];

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b bg-white shadow-sm sm:flex-nowrap">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <PanelLeft className="h-5 w-5 " />
        </Button>
        <Link to="/" className="block">
          <img
            src={logoIcon}
            alt="Logo"
            className="block md:hidden w-[30px] drop-shadow-sm"
          />
          <img
            src={logoImg}
            alt="Logo"
            className="hidden md:block w-[120px] drop-shadow-sm"
          />
        </Link>
      </div>

      <div className="flex flex-col items-center text-center">
        <span className="text-xs text-muted-foreground tracking-wide mb-1">
          Active Board
        </span>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
          <span className="text-base font-semibold text-black">Untitled</span>

          <div className="flex -space-x-2">
            {participants.map((user, i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full bg-white text-black text-sm font-medium border border-black flex items-center justify-center shadow"
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ShareLinkAlertDialog />

        <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-black text-black text-sm font-medium shadow cursor-pointer min-w-0 overflow-hidden">
              <span className="h-6 w-6 flex items-center justify-center text-sm font-semibold">
                {user?.firstName?.[0]}
              </span>
              <ChevronDown className="h-4 w-4 text-black" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link to="/profile">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <DropdownMenu>
              <DropdownMenuItem>
                <LogoutAlertDialog />
              </DropdownMenuItem>
            </DropdownMenu>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
