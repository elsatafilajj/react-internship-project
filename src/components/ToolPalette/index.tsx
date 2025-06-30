import clsx from 'clsx';
import { ZoomOutIcon, ZoomInIcon, FilePlus2 } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { DragPreviewImage } from 'react-dnd';
import { useParams } from 'react-router-dom';
import { useControls } from 'react-zoom-pan-pinch';

import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import noteDragIcon from '@/assets/images/note-drag-icon-plus.svg';
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

  const [, drag, preview] = useNoteDrag({
    noteRef: stickyNoteRef,
    type: DragNoteTypes.NewNote,
    isNew: true,
  });

  useEffect(() => {
    if (!isDragDisabled) {
      drag(stickyNoteRef);
    }
  }, [isDragDisabled, drag]);

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
                    <DragPreviewImage connect={preview} src={noteDragIcon} />
                    <FilePlus2 />
                  </Button>
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>Drag note</TooltipContent>
        </Tooltip>

        <Tooltip>
          <div id="zoom-in" className="flex flex-col items-center gap-1.5">
            <TooltipTrigger>
              <Button
                size="icon"
                onClick={() => zoomIn()}
                className="transition hover:text-foreground bg-tool-palette text-foreground"
              >
                <ZoomInIcon />
              </Button>
            </TooltipTrigger>
          </div>
          <TooltipContent>Zoom in</TooltipContent>
        </Tooltip>

        <Tooltip>
          <div id="zoom-out" className="flex flex-col items-center gap-1.5">
            <TooltipTrigger>
              <Button
                size="icon"
                onClick={() => zoomOut()}
                className="transition hover:text-foreground bg-tool-palette text-foreground"
              >
                <ZoomOutIcon />
              </Button>
            </TooltipTrigger>
          </div>
          <TooltipContent>Zoom out</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
