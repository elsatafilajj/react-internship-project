import { History } from 'lucide-react';

import { ActivityPanel } from '@/components/ActivityPanel';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

export const ActivityPanelToggle = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group fixed top-[75px] right-5 z-50 bg-card border border-gray-300 text-foreground shadow-md hover:transform hover:scale-110 transition-transform duration-200"
        >
          <div className="p-2" id="activity">
            <History className="h-5 w-5" />
          </div>

          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-black text-xs px-2 py-1 rounded shadow pointer-events-none">
            Activity
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-80 top-18 max-h-[92vh] rounded-tl-xl rounded-bl-xl shadow-xl border border-gray-200 overflow-y-auto"
      >
        <ActivityPanel />
      </SheetContent>
    </Sheet>
  );
};
