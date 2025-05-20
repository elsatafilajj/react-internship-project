import { useEffect, useRef, useState } from 'react';
// import { useDrop } from 'react-dnd';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { DraggableNote } from '@/components/DraggableNote';
import { ItemTypes } from '@/constants/itemTypes';
// import { ItemTypes } from '@/constants/itemTypes';
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
    type: ItemTypes.Note,
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
    type: ItemTypes.NewNote,
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
      className="w-full h-full min-w-[350vw] min-h-[350vh] relative "
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
