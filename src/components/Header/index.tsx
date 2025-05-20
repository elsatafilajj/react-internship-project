import { ChevronDown, PanelLeft, User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { LogoutAlertDialog } from '@/components/LogoutAlertDialog';
import { RoomActionsDropDown } from '@/components/RoomActionDropDown';
import { ShareLinkAlertDialog } from '@/components/ShareLinkAlertDialog';
import { Logo } from '@/components/shared/Logo';
import { ThemeChangeToggle } from '@/components/shared/ThemeChangeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const participants = [{ name: 'Ben' }, { name: 'Alice' }, { name: 'Elara' }];
  const { roomId } = useParams<{ roomId: string }>();

  const isUserInRoom = Boolean(roomId);

  return (
    <header className="sticky top-0 z-30 w-full flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b bg-secondary shadow-sm sm:flex-nowrap">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <PanelLeft className="h-5 w-5 " />
        </Button>
        <Link to="/" className="block">
          <Logo className="hidden md:block w-[120px] drop-shadow-sm" />
        </Link>
      </div>

      <div className="hidden sm:flex flex-col items-center text-center ">
        <span className="text-xs text-muted-foreground tracking-wide mb-1">
          Active Room
        </span>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
          <span className="text-base font-semibold text-foreground">
            {data?.data.title || ''}
          </span>

          <div className="flex -space-x-2">
            {participants.map((user, i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full bg-secondary text-sm font-medium border-2 border-foreground flex items-center justify-center shadow"
              >
                <p className="text-accent-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isUserInRoom && <RoomActionsDropDown />}
        <ShareLinkAlertDialog />

        <ThemeChangeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary border-2 border-foreground text-foreground text-sm font-medium shadow cursor-pointer min-w-0 overflow-hidden">
              <User />
              <ChevronDown className="h-4 w-4 text-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col  p-1.5">
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
