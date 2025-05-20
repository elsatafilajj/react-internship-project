import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { Note } from '@/components/Note';

interface NoteProps {
  uuid: string;
  left: number;
  top: number;
  setTransformDisabled: (b: boolean) => void;
  transformRef: React.RefObject<ReactZoomPanPinchRef>;
}

export const DraggableNote = ({
  uuid,
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
        return { uuid, left, top, offsetX: 0, offsetY: 0 };
      }

      const { scale, positionX, positionY } = transformState;

      const offsetX = (clientOffset.x - boundingRect.left - positionX) / scale;
      const offsetY = (clientOffset.y - boundingRect.top - positionY) / scale;

      return {
        uuid,
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
        opacity: isDragging ? 0 : 1,
      }}
      onMouseDown={() => setTransformDisabled(true)}
      onDragEnd={() => setTransformDisabled(false)}
      onMouseUp={() => setTransformDisabled(false)}
    >
      <Note />
    </div>
  );
};
