import type { RefObject } from 'react';
import { useDrag } from 'react-dnd';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { ItemTypes } from '@/constants/itemTypes';

interface UseNoteDragProps {
  noteId?: number;
  type: ItemTypes;
  noteRef: RefObject<HTMLElement>;
  transformRef?: RefObject<ReactZoomPanPinchRef>;
  xAxis?: number;
  yAxis?: number;
  isNew?: boolean;
}

export const useNoteDrag = ({
  noteId = Date.now(),
  type,
  noteRef,
  transformRef,
  xAxis = 0,
  yAxis = 0,
  isNew = false,
}: UseNoteDragProps) => {
  return useDrag(() => ({
    type,
    item: (monitor) => {
      const rect = noteRef.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset() || { x: 0, y: 0 };

      if (isNew) {
        const noteWidth = 144;
        const noteHeight = 288;

        const offsetX = clientOffset.x - (rect?.left ?? 0) + noteWidth;
        const offsetY = clientOffset.y - (rect?.top ?? 0) + noteHeight;

        return {
          type,
          noteId,
          offsetX,
          offsetY,
        };
      }

      const transformState = transformRef?.current?.instance?.transformState;

      if (!transformState || !rect) {
        return { noteId, xAxis, yAxis, offsetX: 0, offsetY: 0 };
      }

      const { scale, positionX, positionY } = transformState;
      const offsetX = (clientOffset.x - rect.left - positionX) / scale;
      const offsetY = (clientOffset.y - rect.top - positionY) / scale;

      return { noteId, xAxis, yAxis, offsetX, offsetY };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
};
