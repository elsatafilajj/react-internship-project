import { MessageSquare } from 'lucide-react';

import { CommentsActivityPanel } from '@/components/CommentsActivityPanel';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

export const PanelToggle = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-[100px] right-4 z-50 bg-card border border-gray-300 text-foreground shadow-md hover:transform hover:scale-110 transition-transform duration-200"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-80 mt-[100px] rounded-tl-xl rounded-bl-xl shadow-xl border border-gray-200 overflow-y-auto"
      >
        <CommentsActivityPanel />
      </SheetContent>
    </Sheet>
  );
};
