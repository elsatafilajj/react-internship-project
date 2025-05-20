
import { PanelLeft, User } from 'lucide-react'; 
import { Link, useParams } from 'react-router-dom';

import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { RoomActionsDropDown } from '@/components/RoomActionDropDown';
import { ShareLinkAlertDialog } from '@/components/ShareLinkAlertDialog';
import { Logo } from '@/components/shared/Logo';
import { ThemeChangeToggle } from '@/components/shared/ThemeChangeToggle';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const participants = [{ name: 'Ben' }, { name: 'Alice' }, { name: 'Elara' }];
  const { roomId } = useParams<{ roomId: string }>();

  const isUserInRoom = Boolean(roomId);

  const { data } = useGetRoomByIdQuery(roomId || '');

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
            {data?.data.title || 'Untitled'}
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

        <Link
          to="/profile"
          className="relative group flex items-center gap-1 rounded-4xl p-1  border-2 border-foreground text-foreground text-sm font-medium shadow cursor-pointer"
        >
          <User />

          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-primary text-black text-xs px-2 py-1 rounded shadow">
            Profile
          </span>
        </Link>
      </div>
    </header>
  );
};
