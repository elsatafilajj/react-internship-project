import { useRef } from 'react';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { CreateNoteInput } from '@/api/Note/note.types';
import { Note } from '@/components/Note';
import { DragNoteTypes } from '@/constants/dragNoteTypes';
import { useNoteDrag } from '@/hooks/useNoteDrag';

interface NoteProps extends CreateNoteInput {
  noteId: number;
  xAxis: number;
  yAxis: number;
  setTransformDisabled: (b: boolean) => void;
  transformRef: React.RefObject<ReactZoomPanPinchRef>;
}

export const DraggableNote = ({
  noteId,
  xAxis,
  yAxis,
  setTransformDisabled,
  transformRef,
}: NoteProps) => {
  const noteRef = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useNoteDrag({
    noteId,
    type: DragNoteTypes.Note,
    noteRef,
    transformRef,
    xAxis,
    yAxis,
  });

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
