import { MessageSquare, Clock3 } from 'lucide-react';
import { useState } from 'react';

import { CommentsActionsDropDown } from '@/components/CommentsActionDropDown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuthContext } from '@/context/AuthContext/AuthContext';

export const CommentsActivityPanel = () => {
  const { user } = useAuthContext();
  const [comment] = useState(false);

  return (
    <aside className="w-full bg-card h-screen text-card-revert flex flex-col">
      <Tabs defaultValue="comments" className="flex flex-col flex-1 ">
        <TabsList className="grid grid-cols-2 border-b">
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
              {!comment ? (
                <div className="border rounded-md p-3 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <div className="rounded-full bg-primary w-7 h-7 text-center text-black p-1">
                      {user?.firstName[0].toUpperCase()}
                    </div>
                    {user?.firstName} {user?.lastName}
                  </div>
                  <Input
                    id="comment"
                    name="comment"
                    type="text"
                    placeholder="Comment or add others with @"
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      size="sm"
                      className="bg-transparent text-foreground hover:bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button size="sm">Comment</Button>
                  </div>
                </div>
              ) : (
                <div className="border rounded-md p-3 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <div className="rounded-full bg-primary w-7 h-7 text-center text-black p-1">
                        {user?.firstName[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col mt-1">
                        {user?.firstName} {user?.lastName}
                        <span className="text-[10px] text-foreground pl-0">
                          4:02 PM Today
                        </span>
                      </div>
                    </div>
                    <CommentsActionsDropDown />
                  </div>
                  <p className="text-[15px] my-3">
                    I have an idea for this 💡!
                  </p>
                  <Input
                    id="reply"
                    name="reply"
                    type="text"
                    placeholder="Reply or add others with @"
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      size="sm"
                      className="bg-transparent text-foreground hover:bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button size="sm">Reply</Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="activity" className="flex-1">
          <ScrollArea className="h-full p-4 space-y-3">
            <div className="text-sm text-foreground">
              ✅ <span className="font-medium">Elara</span> added a sticky note
              <span className="text-xs text-foreground ml-1">• 2 min ago</span>
            </div>
            <div className="text-sm text-foreground">
              ✏️ <span className="font-medium">Ben</span> renamed the session
              <span className="text-xs text-foreground ml-1">• 5 min ago</span>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  );
};
