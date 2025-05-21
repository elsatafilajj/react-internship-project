import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { NoteItem } from '@/api/Note/note.types';
import { useGetAllNotesFromRoomQuery } from '@/api/Note/notes.queries';
import { DraggableNote } from '@/components/DraggableNote';
import { DragNoteTypes } from '@/constants/dragNoteTypes';
import { useNoteDrop } from '@/hooks/useNoteDrop';

interface DroppableRoomProps {
  setTransformDisabled: (b: boolean) => void;
  transformRef: React.RefObject<ReactZoomPanPinchRef>;
}

export const DroppableRoom = ({
  transformRef,
  setTransformDisabled,
}: DroppableRoomProps) => {
  const roomRef = useRef<HTMLDivElement | null>(null);
  const { roomId } = useParams<{ roomId: string }>();

  const { data, isFetched } = useGetAllNotesFromRoomQuery(roomId || '');
  const [notes, setNotes] = useState<Partial<NoteItem>[]>([]);

  useEffect(() => {
    if (isFetched && data) {
      setNotes(data.data);
    }
  }, [data, isFetched]);

  const moveDropRef = useNoteDrop({
    type: DragNoteTypes.Note,
    roomRef,
    transformRef,
    onDrop: (uuid, x, y) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.uuid === uuid ? { ...note, xAxis: x, yAxis: y } : note,
        ),
      );
    },
  });

  const addDropRef = useNoteDrop({
    type: DragNoteTypes.NewNote,
    roomRef,
    transformRef,
    onDrop: (uuid, x, y) => {
      setNotes((prev) => [...prev, { uuid, xAxis: x, yAxis: y }]);
    },
  });

  moveDropRef(roomRef);
  addDropRef(roomRef);

  return (
    <div
      id="room"
      ref={roomRef}
      className="w-full h-full min-w-[350vw] min-h-[350vh] relative bg-gradient-to-br from-[var(--color-background-from)] to-[var(--color-background-to)] p-8 rounded-lg"
    >
      {notes?.map((note: Partial<NoteItem>) => (
        <DraggableNote
          key={note.uuid}
          uuid={note.uuid}
          xAxis={note.xAxis}
          yAxis={note.yAxis}
          setTransformDisabled={setTransformDisabled}
          transformRef={transformRef}
        />
      ))}
    </div>
  );
};
