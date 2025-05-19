
import { ZoomOutIcon, ZoomInIcon, StickerIcon } from 'lucide-react';
import { useRef } from 'react';
import { useDrag } from 'react-dnd';

import { useControls } from 'react-zoom-pan-pinch';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ToolPaletteProps {
  setTransformDisabled: (b: boolean) => void;
}

export const ToolPalette = ({ setTransformDisabled }: ToolPaletteProps) => {
  const { zoomIn, zoomOut } = useControls();

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

  const stickyNoteRef = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: 'new_note',
    item: (monitor) => {
      const rect = stickyNoteRef.current?.getBoundingClientRect();
      const initialOffset = monitor.getInitialClientOffset();

      const noteWidth = 144;
      const noteHeight = 288;

      let offsetX;
      let offsetY;

      if (rect && initialOffset) {
        offsetX = initialOffset.x - rect.left + noteWidth;
        offsetY = initialOffset.y - rect.top + noteHeight;
      }

      const newItem = {
        type: 'new_note',
        noteId: Date.now(),
        offsetX,
        offsetY,
      };

      return newItem;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(stickyNoteRef);

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
