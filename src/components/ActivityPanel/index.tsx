import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useParams } from 'react-router-dom';

import { useGetAllActivitiesForRoom } from '@/api/Activities/activities.queries';

export const ActivityPanel = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const { data, isLoading, isError, error } = useGetAllActivitiesForRoom(
    roomId || '',
  );

  if (isLoading)
    return (
      <p className="text-center mt-10 text-gray-600">Loading activities...</p>
    );
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">
        Error: {(error as Error).message}
      </p>
    );

  return (
    <aside className="w-full bg-card h-screen text-card-revert flex flex-col">
      <ScrollArea className="h-full p-4 space-y-3 mt-7">
        {data?.data.map((activity) => (
          <div className="text-sm text-foreground flex justify-between items-start gap-2 border rounded-md p-3 shadow-sm bg-muted">
            <div className="flex flex-col">
              <span className="font-medium">
                {activity.user.firstName} {activity.activityType} a{' '}
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
