import introJs from 'intro.js';
import { Info } from 'lucide-react';
import { useEffect } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { useTourRefsContext } from '@/context/TourRefsContext/TourRefsContext';
import { TourStep, TourSteps } from '@/helpers/TourSteps';
import { useHasEnteredRoom } from '@/hooks/useHasEnteredRoom';

interface TourLauncherProps {
  onToggleSidebar: () => void;
}

export const TourLauncher = ({ onToggleSidebar }: TourLauncherProps) => {
  const { isUserNewlyCreated } = useAuthContext();
  const isUserEnteredInRoom = useHasEnteredRoom();

  const { tourRef } = useTourRefsContext();

  const tourSteps: TourStep[] = TourSteps(isUserEnteredInRoom);

  const startTour = () => {
    setTimeout(() => {
      const intro = introJs();

      intro.setOptions({
        steps: tourSteps,
        tooltipClass: 'custom-intro-tooltip',
        overlayOpacity: 0,
        highlightClass: 'bg-primary/20 shadow-none',
        buttonClass: buttonVariants({ variant: 'default', size: 'sm' }),
        skipLabel: 'x',
      });

      intro.onchange(() => {
        const currentStep = intro._currentStep;
        if (currentStep === 2 || currentStep === 6) {
          onToggleSidebar();
        }
      });

      intro.start();
    }, 500);
  };

  useEffect(() => {
    if (isUserNewlyCreated) {
      startTour();
    }
  }, [isUserNewlyCreated]);

  return (
    <div ref={tourRef}>
      <Info
        onClick={startTour}
        className="bg-primary rounded-full p-0.5 w-7 h-auto"
        strokeWidth={1.5}
        color="black"
      />
    </div>
  );
};
