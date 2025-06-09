import introJs from 'intro.js';
import { Info } from 'lucide-react';
import { useEffect } from 'react';

import { TourRefs } from '@/components/TourSteps/TourSteps';
import { TourSteps } from '@/components/TourSteps/TourSteps';
import { buttonVariants } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext/AuthContext';

interface TourLauncherProps {
  onToggleSidebar: () => void;
}

export const TourLauncher = ({ onToggleSidebar }: TourLauncherProps) => {
  const { isUserNewlyCreated } = useAuthContext();

  const tourSteps = TourSteps();

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

      onToggleSidebar();

      intro.onchange(() => {
        const currentStep = intro._currentStep;
        if (currentStep === 4) onToggleSidebar();
      });

      intro.start();
    }, 300);
  };

  useEffect(() => {
    if (isUserNewlyCreated) {
      startTour();
    }
  }, [isUserNewlyCreated]);

  return (
    <div ref={TourRefs.tourRef}>
      <Info
        onClick={startTour}
        className="bg-primary rounded-full p-0.5 w-7 h-auto"
        strokeWidth={1.5}
        color="black"
      />
    </div>
  );
};
