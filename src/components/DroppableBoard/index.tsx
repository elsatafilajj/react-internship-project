import { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { DraggableNote } from '@/components/DraggableNote';

interface DroppableBoardProps {
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

export const DroppableBoard = ({
  transformRef,
  setTransformDisabled,
}: DroppableBoardProps) => {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [notes, setNotes] = useState<NoteProps[]>([]);

  useEffect(() => {
    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      setNotes([
        { id: 1, xAxis: centerX + 100, yAxis: centerY },
        { id: 2, xAxis: centerX - 400, yAxis: centerY - 400 },
      ]);
    }
  }, []);

  const [, drop] = useDrop(() => ({
    accept: 'note',
    drop: (item: DraggedNoteItem, monitor) => {
      const client = monitor.getClientOffset();

      const boardEl = boardRef.current;
      const transformState = transformRef.current?.instance?.transformState;

      if (!client || !boardEl || !transformState) return;

      const { scale, positionX, positionY } = transformState;

      const realX =
        (client.x - boardEl.getBoundingClientRect().left) / scale -
        positionX / scale -
        item.offsetX;
      const realY =
        (client.y - boardEl.getBoundingClientRect().top) / scale -
        positionY / scale -
        item.offsetY;

      const boardWidth = boardEl.offsetWidth;
      const boardHeight = boardEl.offsetHeight;

      const withinBoundsX = Math.max(0, Math.min(boardWidth - 288, realX));
      const withinBoundsY = Math.max(0, Math.min(boardHeight - 270, realY));

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

  drop(boardRef);

  return (
    <div
      id="board"
      ref={boardRef}
      className="w-full h-full min-w-[350vw] min-h-[350vh] relative bg-[url('../assets/images/dotted-pattern.svg')] bg-repeat"
    >
      <div className="absolute top-0 left-0 w-full h-full" />

      {notes.map((note) => (
        <DraggableNote
          key={note.id}
          id={note.id}
          left={note.xAxis}
          top={note.yAxis}
          setTransformDisabled={setTransformDisabled}
          transformRef={transformRef}
        />
      ))}
    </div>
  );
};
