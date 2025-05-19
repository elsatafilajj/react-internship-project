import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { NoteItem } from '@/api/Note/note.types';
import { Note } from '@/components/Note';
import { ItemTypes } from '@/constants/itemTypes';

interface NoteProps extends Partial<NoteItem> {
  setTransformDisabled: (b: boolean) => void;
  transformRef: React.RefObject<ReactZoomPanPinchRef>;
}

export const DraggableNote = ({
  uuid,
  xAxis,
  yAxis,
  setTransformDisabled,
  transformRef,
}: NoteProps) => {
  const noteRef = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.Note,

    item: (monitor) => {
      const boundingRect = noteRef.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset() || { x: 0, y: 0 };

      const transformState = transformRef.current?.instance?.transformState;
      if (!transformState || !boundingRect) {
        return { uuid, xAxis, yAxis, offsetX: 0, offsetY: 0 };
      }

      const { scale, positionX, positionY } = transformState;

      const offsetX = (clientOffset.x - boundingRect.left - positionX) / scale;
      const offsetY = (clientOffset.y - boundingRect.top - positionY) / scale;

      return {
        uuid,
        xAxis,
        yAxis,
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
        left: xAxis,
        top: yAxis,
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
