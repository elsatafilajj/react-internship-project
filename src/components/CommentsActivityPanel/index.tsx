import { MessageSquare, Clock3, UserCircle2 } from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const CommentsActivityPanel = () => {
  return (
    <aside className="w-full h-screen text-black flex flex-col">
      <Tabs defaultValue="comments" className="flex flex-col flex-1 ">
        <TabsList className="grid grid-cols-2 border-b border-gray-200">
          <TabsTrigger
            value="comments"
            className="flex justify-center items-center gap-1 text-sm"
          >
            <MessageSquare className="h-4 w-4" />
            Comments
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="flex justify-center items-center gap-1 text-sm"
          >
            <Clock3 className="h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comments" className="flex-1">
          <ScrollArea className="h-full p-4 space-y-4">
            <div className="space-y-4">
              <div className="border rounded-md p-3 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <UserCircle2 className="h-4 w-4 text-gray-400" />
                    Elara
                  </div>
                  <span className="text-xs text-gray-400">2 min ago</span>
                </div>
                <p className="text-sm text-gray-700">
                  “What if we made the palette dockable?”
                </p>
              </div>

              <div className="border rounded-md p-3 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <UserCircle2 className="h-4 w-4 text-gray-400" />
                    Ben
                  </div>
                  <span className="text-xs text-gray-400">5 min ago</span>
                </div>
                <p className="text-sm text-gray-700">
                  “I think its better like this!”
                </p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="activity" className="flex-1">
          <ScrollArea className="h-full p-4 space-y-3">
            <div className="text-sm text-gray-800">
              ✅ <span className="font-medium">Elara</span> added a sticky note
              <span className="text-xs text-gray-400 ml-1">• 2 min ago</span>
            </div>
            <div className="text-sm text-gray-800">
              ✏️ <span className="font-medium">Ben</span> renamed the session
              <span className="text-xs text-gray-400 ml-1">• 5 min ago</span>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  );
};
