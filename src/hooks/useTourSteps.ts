import { useParams } from 'react-router-dom';

import {
  useGetRoomByIdQuery,
  useGetRoomHostQuery,
} from '@/api/Room/room.queries';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { useHasEnteredRoom } from '@/hooks/useHasEnteredRoom';

export interface TourStep {
  title?: string;
  intro: string;
  element?: HTMLElement | null;
}

export const useTourSteps = () => {
  const hasEnteredRoom = useHasEnteredRoom();

  const { roomId } = useParams<{ roomId: string }>();
  const { data } = useGetRoomByIdQuery(roomId || '');
  const isRoomActive = data?.data?.isActive;

  const isInArchivedRoomsDashboard =
    window.location.pathname === '/rooms/archived';

  const { user } = useAuthContext();
  const { data: roomHost } = useGetRoomHostQuery(roomId || '');
  const isHost = roomHost?.data?.uuid === user?.uuid;

  const getSteps = (): TourStep[] => [
    {
      title: !hasEnteredRoom ? 'Welcome to your Stuck Tour!' : '',
      intro: !hasEnteredRoom
        ? 'Let’s take a quick tour of Stuck — your space for collaboration, brainstorming, and creative problem-solving!'
        : "Let's take a further step into your room tour",
    },
    ...(!hasEnteredRoom
      ? [
          {
            intro: isInArchivedRoomsDashboard
              ? 'Here you can see all of your archived rooms'
              : 'Here you can manage all of your rooms',

            element: isInArchivedRoomsDashboard
              ? document.getElementById('archived-rooms')
              : document.getElementById('rooms'),
          },
          {
            element: document.getElementById('sidebar'),
            intro:
              'Here you can find more and navigate through the application!',
          },
          { intro: 'Then in the sidebar' },
          {
            element: document.getElementById('create-edit-room'),
            intro: hasEnteredRoom
              ? isHost
                ? 'Edit your room’s title here to keep things organized and clear.'
                : 'Only the host can edit the room title. If you need to change it, ask the host to do so.'
              : 'You can create a brand new room. Just click here!',
          },
          {
            element: document.getElementById('room'),
            intro:
              'Here’s where you’ll find all the rooms you’ve joined — your creative hubs!',
          },
          {
            element: document.getElementById('archive'),
            intro: 'Archived rooms live here — nothing’s ever truly lost!',
          },
          {
            element: document.getElementById('theme'),
            intro:
              'Customize your experience by toggling between light and dark themes.',
          },
          {
            element: document.getElementById('tour'),
            intro:
              'Want to find out more? Restart the tour anytime from here on any page!',
          },
        ]
      : []),
    ...(hasEnteredRoom
      ? [
          {
            element: document.getElementById('note'),
            intro: isRoomActive
              ? 'Drag this icon to create a new note and keep the ideas flowing!'
              : 'Notes can’t be created in a locked room — but you can still browse and reflect on what was discussed.',
          },
          {
            element: document.getElementById('zoom-in'),
            intro: 'Click here to zoom in, in a centered manner!',
          },
          {
            element: document.getElementById('zoom-out'),
            intro: 'And click here to zoom back out.',
          },
          {
            element: document.getElementById('participants'),
            intro: isRoomActive
              ? isHost
                ? 'See and manage all participants here — you can even kick someone if needed.'
                : 'Here’s the list of everyone in this room. If you want someone to be kicked from the room ask the host to do so!'
              : 'This is the list of everyone who participated. Since this room is locked, no new members can join.',
          },
          ...(isRoomActive
            ? [
                {
                  element: document.getElementById('share'),
                  intro: isRoomActive
                    ? 'Invite others to collaborate by sharing this room’s link.'
                    : 'This room is no longer active, so sharing is disabled. But you can revisit what was built here anytime.',
                },
              ]
            : []),
        ]
      : []),
    ...(hasEnteredRoom
      ? [
          {
            element: document.getElementById('room-actions'),
            intro: isRoomActive
              ? isHost
                ? 'As the host, you can manage the room, archive, edit or delete it. And export notes.'
                : 'Here you can export your notes, and leave the room.'
              : isHost
                ? 'You can also only delete and export it.'
                : 'You can also only export it or leave.',
          },
        ]
      : []),
    {
      element: document.getElementById('profile'),
      intro: 'Update your personal info and preferences anytime from here.',
    },
    ...(hasEnteredRoom
      ? [
          {
            element: document.getElementById('activity'),
            intro: isRoomActive
              ? 'Stay updated with live activities and changes happening in this room.'
              : 'This room is locked — no more activities will occur, but you can review all past actions here.',
          },
          {
            intro: isRoomActive
              ? 'Feel free to move notes, change colors, vote on ideas, and share your thoughts. Enjoy!'
              : 'The room being in view-only mode now — all creativity that happened here is saved for your reference.',
          },
        ]
      : []),
  ];
  return getSteps;
};
