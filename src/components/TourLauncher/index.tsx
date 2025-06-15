import introJs from 'intro.js';
import { Binoculars } from 'lucide-react';
import { useEffect } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { useTourRefsContext } from '@/context/TourRefsContext/TourRefsContext';
import { TourStep, useTourSteps } from '@/hooks/useTourSteps';

interface TourLauncherProps {
  onToggleSidebar: () => void;
}

export const TourLauncher = ({ onToggleSidebar }: TourLauncherProps) => {
  const { isUserNewlyCreated } = useAuthContext();

  const { tourRef } = useTourRefsContext();

  const tourSteps: TourStep[] = useTourSteps();

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

        if (!isUserNewlyCreated && currentStep === 0) {
            onToggleSidebar();
        }

         if (currentStep === 0) {
            onToggleSidebar();
        }

        if (currentStep === 0 || currentStep === 2 || currentStep === 9) {
          onToggleSidebar();
        }
      });
      intro.start();
    }, 700);
  };

  useEffect(() => {
    if (isUserNewlyCreated) {
      startTour();
    }
  }, [isUserNewlyCreated]);

  return (
    <div ref={tourRef}>
      <Button variant="ghost"  className="cursor-pointer hover:bg-muted w-full flex justify-start gap-4
      items-center" onClick={startTour}>
        <Binoculars className="stroke-foreground" />
        <p>Stuck Tour</p>
      </Button>
    </div>
  );
};