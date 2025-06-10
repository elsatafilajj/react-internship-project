import { useTourRefsContext } from '@/context/TourRefsContext/TourRefsContext';
import { useHasEnteredRoom } from '@/hooks/useHasEnteredRoom';

export interface TourStep {
  title?: string;
  intro: string;
  element?: HTMLDivElement | null;
}

export const useTourSteps = () => {
  const tourRefs = useTourRefsContext();
  const hasEnteredRoom = useHasEnteredRoom();
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
      element: tourRefs.myRoomsDashboardRef.current,
      intro:
        'Here’s where you’ll find all the rooms you’ve joined — your creative hubs!',
    },
    {
      element: tourRefs.createEditRoomRef.current,
      intro: hasEnteredRoom
        ? 'Edit your room’s title here to keep things organized and clear.'
        : 'You can create a brand new room. Just click here!',
    },
    {
      element: tourRefs.archiveRef.current,
      intro: 'Archived rooms live here — nothing’s ever truly lost!',
    },
    ...(hasEnteredRoom
      ? [
          {
            element: tourRefs.shareLinkRef.current,
            intro:
              'Want to collaborate? Share this link to invite others into your room.',
          },
        ]
      : []),
    {
      element: tourRefs.changeThemeRef.current,
      intro:
        'Customize your experience by toggling between light and dark themes.',
    },
    {
      element: tourRefs.profileRef.current,
      intro: 'Update your personal info and preferences anytime from here.',
    },
    {
      element: tourRefs.tourRef.current,
      intro: 'Need a refresher later? Restart the tour anytime from here.',
    },

    ...(hasEnteredRoom
      ? [
          {
            element: tourRefs.activityRef.current,
            intro:
              'Stay in the loop with real-time updates on everything happening in your room.',
          },
          {
            element: tourRefs.noteDragRef.current,
            intro: 'Drag this icon anywhere on the board to create a new note!',
          },
          {
            intro:
              'You can move notes around, change their colors, vote on the best ones, and most importantly — share your ideas and keep the creativity flowing. Have fun!',
          },
        ]
      : []),
  ];
};
