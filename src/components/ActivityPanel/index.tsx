import { ScrollArea } from '@radix-ui/react-scroll-area';

import { useAuthContext } from '@/context/AuthContext/AuthContext';

export const ActivityPanel = () => {
  const { user } = useAuthContext();

  return (
    <aside className="w-full bg-card h-screen text-card-revert flex flex-col">
      <ScrollArea className="h-full p-4 space-y-3 mt-7">
        <div className="text-sm text-foreground flex justify-between items-start gap-2 border rounded-md p-3 shadow-sm bg-muted">
          <div className="flex flex-col">
            <span className="font-medium">
              {user?.firstname} added a sticky note
            </span>
            <span className="text-xs text-muted-foreground">2 min ago</span>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};
