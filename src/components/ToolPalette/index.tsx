import { ZoomOutIcon, ZoomInIcon, StickerIcon } from 'lucide-react';
import { useRef } from 'react';
import { useControls } from 'react-zoom-pan-pinch';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ItemTypes } from '@/constants/itemTypes';
import { useNoteDrag } from '@/hooks/useNoteDrag';

interface ToolPaletteProps {
  setTransformDisabled: (b: boolean) => void;
}

export const ToolPalette = ({ setTransformDisabled }: ToolPaletteProps) => {
  const { zoomIn, zoomOut } = useControls();

  const stickyNoteRef = useRef<HTMLDivElement>(null);

  const [, drag] = useNoteDrag({
    noteRef: stickyNoteRef,
    type: ItemTypes.NewNote,
    isNew: true,
  });

  drag(stickyNoteRef);

  const tools = [
    {
      icon: ZoomInIcon,
      label: 'Zoom in',
      tip: 'Zoom in',
      function: zoomIn,
    },
    {
      icon: ZoomOutIcon,
      label: 'Zoom out',
      tip: 'Zoom out',
      function: zoomOut,
    },
  ];

  return (
    <TooltipProvider>
      <div className="bg-secondary border border-muted-foreground/45 rounded-xl shadow-md px-6 py-2 flex items-center gap-6 w-fit">
        <Tooltip>
          <TooltipTrigger>
            <div
              className="gap-1.5 flex flex-col items-center"
              onMouseDown={() => setTransformDisabled(true)}
              onDragEnd={() => setTransformDisabled(false)}
              onMouseUp={() => setTransformDisabled(false)}
            >
              <div ref={stickyNoteRef}>
                <Button size="icon">
                  <StickerIcon />
                </Button>
              </div>
              <span className="text-xs font-medium text-foreground/70">
                Sticky Note
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>Drag note on the board</TooltipContent>
        </Tooltip>
        {tools.map((tool, index) => (
          <Tooltip key={index}>
            <div className="flex flex-col items-center gap-1.5">
              <TooltipTrigger>
                <Button
                  size="icon"
                  onClick={() => tool.function()}
                  className="transition hover:text-foreground "
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
