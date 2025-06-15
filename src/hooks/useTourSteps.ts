import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { useGetAllUsersByRoomQuery } from '@/api/User/user.query';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { useTourRefsContext } from '@/context/TourRefsContext/TourRefsContext';
import { useHasEnteredRoom } from '@/hooks/useHasEnteredRoom';
import { useParams } from 'react-router-dom';

export interface TourStep {
  title?: string;
  intro: string;
  element?: HTMLDivElement | null;
}

export const useTourSteps = () => {
  const tourRefs = useTourRefsContext();
  const hasEnteredRoom = useHasEnteredRoom();

  const { roomId } = useParams<{ roomId: string }>();
  const { data } = useGetRoomByIdQuery(roomId || '')
  const isRoomActive = data?.data?.isActive;


  const { user } = useAuthContext();
  const { data: users } = useGetAllUsersByRoomQuery(roomId || '');
  const roomHost = users?.data.find((user) => user.role === 'host');
  const isHost = roomHost?.uuid === user?.uuid;

  return [
    {
      title: 'Welcome to your Stuck Tour!',
      intro:
        'Let’s take a quick tour of Stuck — your space for collaboration, brainstorming, and creative problem-solving!',
    },
    {
      element: tourRefs.toggleSidebarIconRef.current,
      intro: 'Here you can find more and navigate through the application!',
    },
    { intro: 'Then in the sidebar' },
    {
      element: tourRefs.createEditRoomRef.current,
      intro: hasEnteredRoom
        ? isHost ? 'Edit your room’s title here to keep things organized and clear.' : 'Only the host can edit the room title. If you need to change it, ask the host to do so.'
        : 'You can create a brand new room. Just click here!',
    },
    {
      element: tourRefs.myRoomsDashboardRef.current,
      intro:
        'Here’s where you’ll find all the rooms you’ve joined — your creative hubs!',
    },
    {
      element: tourRefs.archiveRef.current,
      intro: 'Archived rooms live here — nothing’s ever truly lost!',
    },
    {
      element: tourRefs.changeThemeRef.current,
      intro:
        'Customize your experience by toggling between light and dark themes.',
    },
    {
      element: tourRefs.tourRef.current,
      intro: 'Need a refresher later? Restart the tour anytime from here.',
    },
    ...(hasEnteredRoom
      ? [
          {
            element: tourRefs.exportDataRef.current,
            intro:
              `Need to ${isRoomActive ? 'save' : 'review'} your work? Export your notes in various formats like JSON, CSV, XML, or PDF.`,
          },
          {
            element: tourRefs.participantsRef.current,
            intro: isRoomActive
              ? isHost ? 'See and manage all participants here — you can even remove someone if needed.' : 'Here’s the list of everyone in this room. If you want someone to be removed from the room ask the host to do so!'
              : 'This is the list of everyone who participated. Since this room is locked, no new members can join or leave.',
          },
          {
            element: tourRefs.shareLinkRef.current,
            intro: isRoomActive
              ? 'Invite others to collaborate by sharing this room’s link.'
              : 'This room is no longer active, so sharing is disabled. But you can revisit what was built here anytime.',
        },
      ]
      : []),
      ...(hasEnteredRoom && isHost ? [
        {
          element: tourRefs.roomActionsRef.current,
          intro: 'As the host, you can manage room settings, archive, or delete it.',
        },
      ] : []
      ),
      {
        element: tourRefs.profileRef.current,
        intro: 'Update your personal info and preferences anytime from here.',
      },
      ...(hasEnteredRoom
      ? [
          {
            element: tourRefs.activityRef.current,
            intro: isRoomActive
            ? 'Stay updated with live activities and changes happening in this room.'
            : 'This room is locked — no more activities will occur, but you can review all past actions here.',
          },
          {  
            element: tourRefs.noteDragRef.current,
            intro: isRoomActive
              ? 'Drag this icon to create a new note and keep the ideas flowing!'
              : 'Notes can’t be created in a locked room — but you can still browse and reflect on what was discussed.',
          },
          {
          intro: isRoomActive
            ? 'Feel free to move notes, change colors, vote on ideas, and share your thoughts.'
            : 'The room is in view-only mode now — all creativity that happened here is saved for your reference.',
          },
        ]
      : []),
  ];
};
