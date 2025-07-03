import { ScrollArea } from '@radix-ui/react-scroll-area';
import { CloudOff } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useControls } from 'react-zoom-pan-pinch';

import { useGetAllActivitiesForRoom } from '@/api/Activities/activities.queries';
import { ActivityResponse } from '@/api/Activities/activitites.types';
import { socketEvents } from '@/constants/socketEvents';
import { useNoteScrollContext } from '@/context/NoteScrollContext/NoteScrollContext';
import { getFormattedDate } from '@/helpers/getFormattedDate';
import { getSocket } from '@/helpers/socket';

export const ActivityPanel = () => {
  const [activities, setActivities] = useState<Partial<ActivityResponse>[]>([]);
  const { roomId } = useParams<{ roomId: string }>();
  const { data, isFetched } = useGetAllActivitiesForRoom(roomId || '');

  const socket = useMemo(() => getSocket(), []);
  const { scrollToNote } = useNoteScrollContext();
  const { zoomOut } = useControls();

  useEffect(() => {
    if (isFetched && data) {
      setActivities(data?.data);
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

  const handleActivityClick = (resourceId: string) => {
    if (resourceId) {
      scrollToNote(resourceId);
    }
    zoomOut();
  };
  const sortedActivities = data?.data
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <aside className="bg-card text-card-revert pt-5 flex flex-col h-full max-h-[92vh] rounded-md overflow-hidden shadow-md border">
      <ScrollArea className="flex-1 p-4 space-y-4 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-gray-500 py-4 flex justify-center gap-3">
            <span className="">
              <CloudOff />
            </span>
            No activities yet
          </p>
        ) : (
          sortedActivities?.map((activity) => (
            <div
              key={activity.uuid}
              className="text-sm text-foreground flex justify-between items-start gap-2 border rounded-md p-3 shadow-sm bg-muted cursor-pointer"
              onClick={() => handleActivityClick(activity.resourceId || '')}
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
          ))
        )}
      </ScrollArea>
    </aside>
  );
};
