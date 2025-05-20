import { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useParams } from 'react-router-dom';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { useGetAllNotesFromRoomQuery } from '@/api/Note/notes.queries';
import { DraggableNote } from '@/components/DraggableNote';

interface DroppableRoomProps {
  setTransformDisabled: (b: boolean) => void;
  transformRef: React.RefObject<ReactZoomPanPinchRef>;
}

interface DraggedNoteItem {
  id: number;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
}

interface NoteProps {
  id: number;
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
        { id: 1, xAxis: centerX + 100, yAxis: centerY },
        { id: 2, xAxis: centerX - 400, yAxis: centerY - 400 },
      ]);
    }
  }, []);

  const { roomId } = useParams<{ roomId: string }>();

  const { data } = useGetAllNotesFromRoomQuery(roomId || '');

  const [, drop] = useDrop(() => ({
    accept: 'note',
    drop: (item: DraggedNoteItem, monitor) => {
      const client = monitor.getClientOffset();

      const roomEl = roomRef.current;
      const transformState = transformRef.current?.instance?.transformState;

      if (!client || !roomEl || !transformState) return;

      const { scale, positionX, positionY } = transformState;

      const realX =
        (client.x - roomEl.getBoundingClientRect().left) / scale -
        positionX / scale -
        item.offsetX;
      const realY =
        (client.y - roomEl.getBoundingClientRect().top) / scale -
        positionY / scale -
        item.offsetY;

      const roomWidth = roomEl.offsetWidth;
      const roomHeight = roomEl.offsetHeight;

      const withinBoundsX = Math.max(0, Math.min(roomWidth - 288, realX));
      const withinBoundsY = Math.max(0, Math.min(roomHeight - 270, realY));

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === item.id
            ? { ...note, xAxis: withinBoundsX, yAxis: withinBoundsY }
            : note,
        ),
      );
    },
    collect: (m) => ({ isOver: m.isOver() }),
  }));

  drop(roomRef);

  return (
    <div
      id="room"
      ref={roomRef}
      className="w-full h-full min-w-[350vw] min-h-[350vh] relative bg-gradient-to-br from-[var(--color-background-from)] to-[var(--color-background-to)] p-8 rounded-lg"
    >
      {data?.data.map((note) => (
        <DraggableNote
          key={note.uuid}
          uuid={note.uuid}
          left={note.xAxis}
          top={note.yAxis}
          setTransformDisabled={setTransformDisabled}
          transformRef={transformRef}
        />
      ))}
    </div>
  );
};
