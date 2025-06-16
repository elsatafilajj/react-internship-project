import clsx from 'clsx';
import { ZoomOutIcon, ZoomInIcon, FilePlus2 } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useControls } from 'react-zoom-pan-pinch';

import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DragNoteTypes } from '@/constants/dragNoteTypes';
import { useNoteDrag } from '@/hooks/useNoteDrag';

interface ToolPaletteProps {
  setTransformDisabled: (b: boolean) => void;
}

export const ToolPalette = ({ setTransformDisabled }: ToolPaletteProps) => {
  const { zoomIn, zoomOut } = useControls();

  const stickyNoteRef = useRef<HTMLDivElement>(null);
  const { roomId } = useParams<{ roomId: string }>();
  const { data } = useGetRoomByIdQuery(roomId || '');

  const isDragDisabled = !data?.data?.isActive;

  const [, drag] = useNoteDrag({
    noteRef: stickyNoteRef,
    type: DragNoteTypes.NewNote,
    isNew: true,
  });

  useEffect(() => {
    if (!isDragDisabled) {
      drag(stickyNoteRef);
    }
  }, [isDragDisabled, drag]);

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
      <div className="bg-secondary border border-muted-foreground/45 rounded-xl shadow-md px-4 py-3 flex items-center gap-4 w-fit">
        <Tooltip>
          <TooltipTrigger>
            <div
              aria-disabled={isDragDisabled}
              className={clsx(
                'gap-1.5 flex flex-col items-center',
                isDragDisabled && 'pointer-events-none opacity-50',
              )}
              onMouseDown={(e) => {
                if (isDragDisabled) e.preventDefault();
                else setTransformDisabled(true);
              }}
              onDragEnd={() => !isDragDisabled && setTransformDisabled(false)}
              onMouseUp={() => !isDragDisabled && setTransformDisabled(false)}
            >
              <div ref={stickyNoteRef}>
                <div id="note">
                  <Button
                    size="icon"
                    disabled={isDragDisabled}
                    className={clsx(
                      'transition hover:text-foreground bg-tool-palette text-foreground',
                      isDragDisabled &&
                        'disabled:cursor-not-allowed opacity-50',
                    )}
                  >
                    <FilePlus2 />
                  </Button>
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>Drag note</TooltipContent>
        </Tooltip>

        {tools.map((tool, index) => (
          <Tooltip key={index}>
            <div className="flex flex-col items-center gap-1.5">
              <TooltipTrigger>
                <Button
                  size="icon"
                  disabled={isDragDisabled}
                  onClick={() => !isDragDisabled && tool.function()}
                  className={clsx(
                    'transition hover:text-foreground bg-tool-palette text-foreground',
                    isDragDisabled && 'disabled:cursor-not-allowed opacity-50',
                  )}
                >
                  <tool.icon />
                </Button>
              </TooltipTrigger>
            </div>
            <TooltipContent>{tool.tip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
