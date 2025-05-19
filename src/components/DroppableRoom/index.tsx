import { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { DraggableNote } from '@/components/DraggableNote';
import { ItemTypes } from '@/constants/itemTypes';

interface DroppableRoomProps {
  setTransformDisabled: (b: boolean) => void;
  transformRef: React.RefObject<ReactZoomPanPinchRef>;
}

interface DraggedNoteItem {
  noteId: number;
  xAxis: number;
  yAxis: number;
  offsetX: number;
  offsetY: number;
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

  const [, moveDrop] = useDrop(() => ({
    accept: ItemTypes.Note,
    drop: (item: DraggedNoteItem, monitor) => {
      const client = monitor.getClientOffset();
      const roomEl = roomRef.current;
      const transformState = transformRef.current?.instance?.transformState;

      if (!client || !roomEl || !transformState) return;

      const { scale, positionX, positionY } = transformState;

      const realX =
        (client.x - roomEl.getBoundingClientRect().left - positionX) / scale -
        item.offsetX;
      const realY =
        (client.y - roomEl.getBoundingClientRect().top - positionY) / scale -
        item.offsetY;

      const roomWidth = roomEl.offsetWidth;
      const roomHeight = roomEl.offsetHeight;

      const withinBoundsX = Math.max(0, Math.min(roomWidth - 288, realX));
      const withinBoundsY = Math.max(0, Math.min(roomHeight - 270, realY));

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.noteId === item.noteId
            ? { ...note, xAxis: withinBoundsX, yAxis: withinBoundsY }
            : note,
        ),
      );
    },
  }));

  moveDrop(roomRef);

  const [, addDrop] = useDrop<DraggedNoteItem>(() => ({
    accept: ItemTypes.NewNote,
    drop: (item, monitor) => {
      const client = monitor.getClientOffset();
      const transformState = transformRef.current?.instance?.transformState;
      const roomEl = roomRef.current;

      if (!client || !transformState || !roomEl) return;

      const { scale, positionX, positionY } = transformState;

      const realX = (client.x - positionX) / scale - item.offsetX;
      const realY = (client.y - positionY) / scale - item.offsetY;

      const withinBoundsX = Math.max(
        0,
        Math.min(roomEl.offsetWidth - 288, realX),
      );
      const withinBoundsY = Math.max(
        0,
        Math.min(roomEl.offsetHeight - 270, realY),
      );

      setNotes((prev) => [
        ...prev,
        { noteId: item.noteId, xAxis: withinBoundsX, yAxis: withinBoundsY },
      ]);
    },
  }));

  addDrop(roomRef);

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
