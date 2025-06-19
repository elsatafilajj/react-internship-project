import { useEffect, RefObject, useRef } from 'react';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { NoteItem } from '@/api/Note/note.types';
import { Note } from '@/components/Note';
import { DragNoteTypes } from '@/constants/dragNoteTypes';
import { useNoteScrollContext } from '@/context/NoteScrollContext/NoteScrollContext';
import { useNoteDrag } from '@/hooks/useNoteDrag';
import { useRoomStatus } from '@/hooks/useRoomStatus';

interface NoteProps extends Partial<NoteItem> {
  note: Partial<NoteItem>;
  setTransformDisabled: (b: boolean) => void;
  transformRef?: RefObject<ReactZoomPanPinchRef>;
  isReadOnly: boolean;
}

export const DraggableNote = ({
  note,
  setTransformDisabled,
  transformRef,
}: NoteProps) => {
  const { uuid, xAxis, yAxis } = note;
  const noteRef = useRef<HTMLDivElement | null>(null);
  const { registerNoteRef } = useNoteScrollContext();

  const { isRoomArchived } = useRoomStatus();

  useEffect(() => {
    registerNoteRef(note.uuid || '', noteRef);
  }, [note.uuid, registerNoteRef]);

  const [{ isDragging }, drag] = useNoteDrag({
    uuid,
    type: DragNoteTypes.Note,
    noteRef,
    transformRef,
    xAxis,
    yAxis,
    isDisabled: isRoomArchived,
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
        zIndex: isDragging ? 'auto' : 10,
      }}
      onMouseDown={() => setTransformDisabled(true)}
      onDragEnd={() => setTransformDisabled(false)}
    >
      <Note
        note={note}
        setTransformDisabled={setTransformDisabled}
        isReadOnly={isRoomArchived}
      />
    </div>
  );
};
