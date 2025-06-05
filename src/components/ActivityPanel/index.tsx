import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useGetAllActivitiesForRoom } from '@/api/Activities/activities.queries';
import { ActivityResponse } from '@/api/Activities/activitites.types';
import { getSocket } from '@/helpers/socket';

export const ActivityPanel = () => {
  const [activities, setActivities] = useState<Partial<ActivityResponse>[]>([]);
  const { roomId } = useParams<{ roomId: string }>();
  const { data, isFetched } = useGetAllActivitiesForRoom(roomId || '');
  const socket = getSocket();

  useEffect(() => {
    if (isFetched && data) {
      setActivities(data.data);
    }
  }, [data, isFetched]);

  useEffect(() => {
    if (!socket) return;
    socket.on('newActivity', (newActivity) =>
      setActivities((prev) => [...prev, newActivity]),
    );

    return () => {
      socket.off('newActivity');
    };
  }, []);

  console.log(activities);

  return (
    <aside className="w-full bg-card h-screen text-card-revert flex flex-col">
      <ScrollArea className="h-full p-4 space-y-3 mt-7">
        {activities?.map((activity) => (
          <div
            key={activity.uuid}
            className="text-sm text-foreground flex justify-between items-start gap-2 border rounded-md p-3 shadow-sm bg-muted"
          >
            <div className="flex flex-col">
              <span className="font-medium">
                {activity?.user?.firstName} {activity.activityType} a{' '}
                {activity.resourceType}
              </span>
              <span className="text-xs text-muted-foreground">2 min ago</span>
            </div>
          </div>
        ))}
      </ScrollArea>
    </aside>
  );
};
