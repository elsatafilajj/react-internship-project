import { createRef } from 'react';

import { useRoomEnteredCheck } from '@/hooks/useRoomEnteredCheck';

export const TourRefs = {
  myRoomsDashboardRef: createRef<HTMLDivElement>(),
  toggleSidebarIconRef: createRef<HTMLDivElement>(),
  createEditRoomRef: createRef<HTMLDivElement>(),
  archiveRef: createRef<HTMLDivElement>(),
  shareLinkRef: createRef<HTMLDivElement>(),
  changeThemeRef: createRef<HTMLDivElement>(),
  profileRef: createRef<HTMLDivElement>(),
  tourRef: createRef<HTMLDivElement>(),
  activityRef: createRef<HTMLDivElement>(),
  noteDragRef: createRef<HTMLDivElement>(),
};

export const TourSteps = () => {
  const isUserEnteredInRoom = useRoomEnteredCheck();

  return [
    {
      title: 'Welcome to your Stuck Tour!',
      intro:
        'Let’s take a quick tour of Stuck — your space for collaboration, brainstorming, and creative problem-solving!',
    },
    {
      element: TourRefs.toggleSidebarIconRef.current,
      intro: 'Here you can find more and navigate through the application!',
    },
    { intro: 'Then in the sidebar' },
    {
      element: TourRefs.myRoomsDashboardRef.current,
      intro:
        'Here’s where you’ll find all the rooms you’ve joined — your creative hubs!',
    },
    {
      element: TourRefs.createEditRoomRef.current,
      intro: isUserEnteredInRoom
        ? 'Edit your room’s title here to keep things organized and clear.'
        : 'You can create a brand new room. Just click here!',
    },
    {
      element: TourRefs.archiveRef.current,
      intro: 'Archived rooms live here — nothing’s ever truly lost!',
    },
    ...(isUserEnteredInRoom
      ? [
          {
            element: TourRefs.shareLinkRef.current,
            intro:
              'Want to collaborate? Share this link to invite others into your room.',
          },
        ]
      : []),
    {
      element: TourRefs.changeThemeRef.current,
      intro:
        'Customize your experience by toggling between light and dark themes.',
    },
    {
      element: TourRefs.profileRef.current,
      intro: 'Update your personal info and preferences anytime from here.',
    },
    {
      element: TourRefs.tourRef.current,
      intro: 'Need a refresher later? Restart the tour anytime from here.',
    },

    ...(isUserEnteredInRoom
      ? [
          {
            element: TourRefs.activityRef.current,
            intro:
              'Stay in the loop with real-time updates on everything happening in your room.',
          },
          {
            element: TourRefs.noteDragRef.current,
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
