import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

interface NoteProps {
  id: number;
  left: number;
  top: number;
  setTransformDisabled: (b: boolean) => void;
  transformRef: React.RefObject<ReactZoomPanPinchRef>;
}

export const DraggableNote = ({
  id,
  left,
  top,
  setTransformDisabled,
  transformRef,
}: NoteProps) => {
  const noteRef = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'note',

    item: (monitor) => {
      const boundingRect = noteRef.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset() || { x: 0, y: 0 };

      const transformState = transformRef.current?.instance?.transformState;
      if (!transformState || !boundingRect) {
        return { id, left, top, offsetX: 0, offsetY: 0 };
      }

      const { scale, positionX, positionY } = transformState;

      const offsetX = (clientOffset.x - boundingRect.left - positionX) / scale;
      const offsetY = (clientOffset.y - boundingRect.top - positionY) / scale;

      return {
        id,
        left,
        top,
        offsetX,
        offsetY,
      };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  drag(noteRef);

  return (
    <div
      ref={noteRef}
      style={{
        position: 'absolute',
        left,
        top,
        opacity: isDragging ? 0.8 : 1,
      }}
      onMouseDown={() => setTransformDisabled(true)}
      onDragEnd={() => setTransformDisabled(false)}
      onMouseUp={() => setTransformDisabled(false)}
    >
      <div className="w-2xs h-min bg-background p-4 rounded-sm">
        <p className="text-foreground">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda
          molestiae itaque omnis nesciunt sequi! Adipisci voluptatibus deserunt
          blanditiis, necessitatibus neque similique inventore exercitationem
          commodi sit officia sapiente molestias enim nihil.
        </p>
      </div>
    </div>
  );
};
