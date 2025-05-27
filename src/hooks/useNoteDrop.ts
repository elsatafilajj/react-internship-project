import { useDrop } from 'react-dnd';
import { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { NoteItem } from '@/api/Note/note.types';
import { DragNoteTypes } from '@/constants/dragNoteTypes';

interface useNoteDropProps {
  type: DragNoteTypes;
  roomRef: React.MutableRefObject<HTMLDivElement | null>;
  transformRef: React.RefObject<ReactZoomPanPinchRef>;
  onDrop: (uuid: string, x: number, y: number) => void;
}

interface DraggedNoteItem extends Partial<NoteItem> {
  offsetX: number;
  offsetY: number;
}

export const useNoteDrop = ({
  type,
  roomRef,
  transformRef,
  onDrop,
}: useNoteDropProps) => {
  const [, dropRef] = useDrop<DraggedNoteItem>(() => ({
    accept: type,
    drop: (item, monitor) => {
      const client = monitor.getClientOffset();
      const roomEl = roomRef.current;
      const transformState = transformRef.current?.instance?.transformState;

      if (!client || !roomEl || !transformState) return;

      const { scale, positionX, positionY } = transformState;

      const roomRect = roomEl.getBoundingClientRect();

      let realX;
      let realY;

      if (type === DragNoteTypes.Note) {
        realX = (client.x - roomRect.left - positionX) / scale - item.offsetX;
        realY = (client.y - roomRect.top - positionY) / scale - item.offsetY;
      } else {
        realX = (client.x - positionX) / scale - item.offsetX;
        realY = (client.y - positionY) / scale - item.offsetY;
      }

      const withinBoundsX = Math.max(
        0,
        Math.min(roomEl.offsetWidth - 288, realX),
      );
      const withinBoundsY = Math.max(
        0,
        Math.min(roomEl.offsetHeight - 270, realY),
      );

      if (item && item.uuid) {
        onDrop(item.uuid, withinBoundsX, withinBoundsY);
      }
    },
  }));

  return dropRef;
};
