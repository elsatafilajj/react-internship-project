import { useEffect, useRef, useState } from 'react';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { DraggableNote } from '@/components/DraggableNote';
import { DragNoteTypes } from '@/constants/dragNoteTypes';
import { useNoteDrop } from '@/hooks/useNoteDrop';

interface DroppableRoomProps {
  setTransformDisabled: (b: boolean) => void;
  transformRef: React.RefObject<ReactZoomPanPinchRef>;
}

interface NoteProps {
  noteId: number;
  xAxis: number;
  yAxis: number;
}

export const DroppableRoom = ({
  transformRef,
  setTransformDisabled,
}: DroppableRoomProps) => {
  const roomRef = useRef<HTMLDivElement | null>(null);
  const [notes, setNotes] = useState<NoteProps[]>([]);

  useEffect(() => {
    if (roomRef.current) {
      const rect = roomRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      setNotes([
        { noteId: 1, xAxis: centerX + 100, yAxis: centerY },
        { noteId: 2, xAxis: centerX - 400, yAxis: centerY - 400 },
      ]);
    }
  }, []);

  const moveDropRef = useNoteDrop({
    type: DragNoteTypes.Note,
    roomRef,
    transformRef,
    onDrop: (noteId, x, y) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.noteId === noteId ? { ...note, xAxis: x, yAxis: y } : note,
        ),
      );
    },
  });

  const addDropRef = useNoteDrop({
    type: DragNoteTypes.NewNote,
    roomRef,
    transformRef,
    onDrop: (noteId, x, y) => {
      setNotes((prev) => [...prev, { noteId, xAxis: x, yAxis: y }]);
    },
  });

  moveDropRef(roomRef);
  addDropRef(roomRef);

  return (
    <div
      id="room"
      ref={roomRef}
      className="w-full h-full min-w-[400vw] min-h-[400vh] relative bg-gradient-to-br from-[var(--color-background-from)] to-[var(--color-background-to)] p-8 rounded-lg"
    >
      <div className="absolute top-0 left-0 w-full h-full" />

      {notes.map((note) => (
        <DraggableNote
          key={note.noteId}
          noteId={note.noteId}
          xAxis={note.xAxis}
          yAxis={note.yAxis}
          setTransformDisabled={setTransformDisabled}
          transformRef={transformRef}
        />
      ))}
    </div>
  );
};
