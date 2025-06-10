import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useGetAllActivitiesForRoom } from '@/api/Activities/activities.queries';
import { ActivityResponse } from '@/api/Activities/activitites.types';
import { socketEvents } from '@/constants/socketEvents';
import { useNoteScroll } from '@/context/NoteContext/NoteContextProvider';
import { getFormattedDate } from '@/helpers/getFormattedDate';
import { getSocket } from '@/helpers/socket';

export const ActivityPanel = () => {
  const [activities, setActivities] = useState<Partial<ActivityResponse>[]>([]);
  const { roomId } = useParams<{ roomId: string }>();
  const { data, isFetched } = useGetAllActivitiesForRoom(roomId || '');
  const socket = getSocket();
  const { scrollToNote } = useNoteScroll();

  useEffect(() => {
    if (isFetched && data) {
      setActivities(data.data);
    }
  }, [data, isFetched]);

  useEffect(() => {
    if (!socket) return;
    socket.on(socketEvents.NewActivity, (newActivity) =>
      setActivities((prev) => [...prev, newActivity]),
    );

    return () => {
      socket.off(socketEvents.NewActivity);
    };
  }, []);

  const handleActivityClick = (activity: Partial<ActivityResponse>) => {
    if (activity.resourceId) {
      scrollToNote(activity.resourceId);
    }
  };

  return (
    <aside className="bg-card text-card-revert pt-5 flex flex-col h-full max-h-[90vh] rounded-md overflow-hidden shadow-md border">
      <ScrollArea className="flex-1 p-4 space-y-4 overflow-y-auto">
        {activities?.map((activity) => (
          <div
            key={activity.uuid}
            className="text-sm text-foreground flex justify-between items-start gap-2 border rounded-md p-3 shadow-sm bg-muted cursor-pointer"
            onClick={() => handleActivityClick(activity)}
          >
            <div className="flex flex-col">
              <span className="font-medium">
                {activity?.user?.firstName} {activity.activityType} a{' '}
                {activity.resourceType}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {getFormattedDate(new Date(activity.createdAt || ''), {
                  day: '2-digit',
                  month: 'short',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        ))}
      </ScrollArea>
    </aside>
  );
};
