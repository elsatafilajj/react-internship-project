import { useMutation } from '@tanstack/react-query';
import { Bell, Share2, Menu, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

import { logout as apiLogout } from '@/api/User/user.client';
import LogoImg from '@/assets/images/logo-full.svg';
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
  const participants = [{ name: 'Ben' }, { name: 'Alice' }, { name: 'Elara' }];

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const { logout } = useAuthContext();

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
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5 " />
        </Button>
        <img src={LogoImg} alt="Logo" className="w-[120px] drop-shadow-sm" />
      </div>

      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground tracking-wide mb-1">
          Active Session
        </span>
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-black">Untitled</span>

          <div className="flex -space-x-2">
            {participants.map((user, i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full bg-white text-black text-sm font-medium border border-black flex items-center justify-center shadow"
              >
                {getInitial(user.name)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button className="bg-gradient-to-r bg-primary text-black px-4 hover:opacity-90 w-[100px]">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-black text-black text-sm font-medium shadow cursor-pointer">
              <span className="h-6 w-6 flex items-center justify-center text-sm font-semibold">
                G
              </span>
              <ChevronDown className="h-4 w-4 text-black" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
