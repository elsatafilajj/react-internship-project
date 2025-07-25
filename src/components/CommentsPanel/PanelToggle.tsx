import { MessageSquare } from 'lucide-react';

import { CommentsPanel } from '@/components/CommentsPanel';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';

interface PanelToggleProps {
  noteId: string;
}

export const PanelToggle = ({ noteId }: PanelToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <MessageSquare className="w-5 h-5" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-80 top-18 rounded-tl-xl rounded-bl-xl shadow-xl border border-gray-200 overflow-y-auto"
      >
        {' '}
        <SheetTitle className="w-full h-full ">
          <CommentsPanel noteId={noteId} />
        </SheetTitle>
      </SheetContent>
    </Sheet>
  );
};
