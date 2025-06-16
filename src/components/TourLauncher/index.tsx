import introJs from 'intro.js';
import { Binoculars } from 'lucide-react';
import { useEffect } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { TourStep, useTourSteps } from '@/hooks/useTourSteps';

interface TourLauncherProps {
  onToggleSidebar: () => void;
  setSideBarToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TourLauncher = ({ onToggleSidebar, setSideBarToggle }: TourLauncherProps) => {
  const { isUserNewlyCreated } = useAuthContext();

  const getTourSteps: () => TourStep[] = useTourSteps();

  const startTour = () => {
    setTimeout(() => {
      const intro = introJs();

      intro.setOptions({
        steps: getTourSteps(),
        tooltipClass: 'custom-intro-tooltip',
        overlayOpacity: 0,
        highlightClass: 'bg-primary/20 shadow-none',
        buttonClass: buttonVariants({ variant: 'default', size: 'sm' }),
        skipLabel: 'x',
      });

      intro.onchange(() => {
        const currentStep = intro._currentStep;

        if (currentStep === 2 || currentStep === 8) {
          onToggleSidebar();
        }
      });

      intro.start();
    }, 300);
  };

  useEffect(() => {
    if (
      isUserNewlyCreated &&
      localStorage.getItem('has-started-initial-tour') !== 'true'
    ) {
      setTimeout(() => {
        startTour();
        setSideBarToggle(false)
        localStorage.setItem('has-started-initial-tour', 'true');
        setSideBarToggle(false)
      }, 1000);
    }
  }, [isUserNewlyCreated]);

  return (
    <div id="tour">
      <Button
        variant="ghost"
        className="cursor-pointer hover:bg-muted w-full flex justify-start gap-4
      items-center"
        onClick={() => {
          startTour();
          onToggleSidebar();
        }}
      >
        <Binoculars className="stroke-foreground" />
        <p>Stuck Tour</p>
      </Button>
    </div>
  );
};
