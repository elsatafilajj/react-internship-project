import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useParams } from 'react-router-dom';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { NoteItem } from '@/api/Note/note.types';
import { useGetAllNotesFromRoomQuery } from '@/api/Note/notes.queries';
import { DraggableNote } from '@/components/DraggableNote';
import { ItemTypes } from '@/constants/itemTypes';

interface DroppableRoomProps {
  setTransformDisabled: (b: boolean) => void;
  transformRef: React.RefObject<ReactZoomPanPinchRef>;
}

interface DraggedNoteItem extends Partial<NoteItem> {
  offsetX: number;
  offsetY: number;
}

export const DroppableRoom = ({
  transformRef,
  setTransformDisabled,
}: DroppableRoomProps) => {
  const roomRef = useRef<HTMLDivElement | null>(null);

  const { roomId } = useParams<{ roomId: string }>();
  const { data } = useGetAllNotesFromRoomQuery(roomId || '');

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
    },
  }));

  addDrop(roomRef);

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
          xAxis={note.xAxis}
          yAxis={note.yAxis}
          setTransformDisabled={setTransformDisabled}
          transformRef={transformRef}
        />
      ))}
    </div>
  );
};
