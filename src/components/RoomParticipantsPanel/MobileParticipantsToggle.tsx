import { UsersRoundIcon } from 'lucide-react';

import { RoomParticipantsPanel } from '@/components/RoomParticipantsPanel';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

export const MobileParticipantsToggle = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group sm:hidden fixed top-[75px] right-15 z-50 bg-card border border-gray-300 text-foreground shadow-md hover:transform hover:scale-110 transition-transform duration-200"
        >
          <UsersRoundIcon className="h-5 w-5" />

          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-black text-xs px-2 py-1 rounded shadow pointer-events-none">
            Participants
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="bg-card w-xs top-25 rounded-s-xl">
        <RoomParticipantsPanel />
      </SheetContent>
    </Sheet>
  );
};
