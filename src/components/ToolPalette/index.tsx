import { Square, ZoomOutIcon, ZoomInIcon } from 'lucide-react';
import { useControls } from 'react-zoom-pan-pinch';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { emptyFunction } from '@/helpers/emptyFunction';

export const ToolPalette = () => {
  const { zoomIn, zoomOut } = useControls();

  const tools = [
    {
      icon: Square,
      label: 'Sticky Note',
      tip: 'Drag note on the board',
      function: emptyFunction,
    },
    {
      icon: ZoomInIcon,
      label: 'Zoom in',
      tip: 'Click to zoom in',
      function: zoomIn,
    },
    {
      icon: ZoomOutIcon,
      label: 'Zoom out',
      tip: 'Click to zoom out',
      function: zoomOut,
    },
  ];

  return (
    <TooltipProvider>
      <div className="bg-card border border-muted-foreground/45 rounded-xl shadow-md px-6 py-2 flex items-center gap-6 w-fit">
        {tools.map((tool, index) => (
          <Tooltip key={index}>
            <div className="flex flex-col items-center gap-0.5">
              <TooltipTrigger>
                <Button
                  size="icon"
                  onClick={() => tool.function()}
                  className="transition hover:text-foreground"
                >
                  <tool.icon />
                </Button>
              </TooltipTrigger>
              <span className="text-xs font-medium text-foreground/70">
                {tool.label}
              </span>
            </div>
            <TooltipContent>{tool.tip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
