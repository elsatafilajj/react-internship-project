import { MessageSquare } from 'lucide-react';

import { CommentsActivityPanel } from '@/components/CommentsActivityPanel';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

interface PanelToggleProps {
  noteId: string;
}

export const PanelToggle = ({ noteId }: PanelToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="bg-card text-foreground shadow-md hover:transform hover:scale-110 transition-transform duration-200 ml-2"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-80 mt-[100px] rounded-tl-xl rounded-bl-xl shadow-xl border border-gray-200 overflow-y-auto"
      >
        <CommentsActivityPanel noteId={noteId} />
      </SheetContent>
    </Sheet>
  );
};
