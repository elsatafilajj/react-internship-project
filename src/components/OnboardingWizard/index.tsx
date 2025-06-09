import introJs from 'intro.js';
import { Info } from 'lucide-react';
import { useEffect } from 'react';

import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { useRoomContext } from '@/context/RoomContext/RoomContext';

interface TourTriggerProps {
  onToggleSidebar: () => void;
}

export const TourTrigger = ({ onToggleSidebar }: TourTriggerProps) => {
  const { isEnteredInRoom } = useRoomContext();
  const { isUserNewlyCreated } = useAuthContext();

  const startTour = () => {
    setTimeout(() => {
      const intro = introJs();

      intro.setOptions({
        steps: [
          {
            title: 'Welcome to your Stuck Tour!',
            intro:
              'Let’s take a quick tour of Stuck – your collaborative space for brainstorming and planning with your team.',
          },
          {
            element: document.getElementById('rooms-dashboard'),
            intro: 'This is where you can find all the rooms you’ve joined.',
          },
          {
            element: document.getElementById('create-edit-room'),
            intro: isEnteredInRoom
              ? 'You can edit the title of your current room here.'
              : 'Click here to create a brand new room and start collaborating!',
          },
          {
            element: document.getElementById('archive'),
            intro: 'Here you’ll find your archived rooms – nothing gets lost.',
          },
          {
            element: document.getElementById('share-link'),
            intro:
              'Need teammates to join you? Use this shareable link to invite them to your room.',
          },
          {
            element: document.getElementById('profile'),
            intro: 'Manage your personal details and preferences from here.',
          },
          {
            element: document.getElementById('tour'),
            intro:
              'Need a refresher? You can restart this tour anytime by clicking here.',
          },
          {
            element: document.getElementById('activity'),
            intro: isEnteredInRoom
              ? 'Keep up with the latest activity in your room right here.'
              : 'Once you join a room, you’ll see its latest activity here.',
          },
          ...(isEnteredInRoom
            ? [
                {
                  element: document.getElementById('note-drag'),
                  intro:
                    'You can drag and drop this icon to create new notes within the room.',
                },
                {
                  intro:
                    'You can move notes around freely, change their colors, vote on ideas, delete them, and most importantly – express your ideas to resolve the discussion. Have fun!',
                },
              ]
            : []),
        ],
        tooltipClass: 'custom-intro-tooltip',
        overlayOpacity: 0,
        highlightClass: 'bg-primary/20 shadow-none',
        buttonClass:
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-primary hover:bg-primary-foreground text-black h-10 rounded-md px-6 has-[>svg]:px-4',
        skipLabel: 'x',
      });

      intro.onchange(() => {
        const currentStep = intro._currentStep;

        if (currentStep === 4) onToggleSidebar();
      });
      onToggleSidebar();
      intro.start();
    }, 100);
  };

  useEffect(() => {
    if (isUserNewlyCreated) startTour();
  }, [isUserNewlyCreated]);

  return (
    <Info
      id="tour"
      onClick={startTour}
      className="bg-primary rounded-full p-0.5 w-7 h-auto"
      strokeWidth={1.5}
      color="black"
    />
  );
};
