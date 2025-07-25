import type { RefObject } from 'react';
import { useDrag } from 'react-dnd';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { DragNoteTypes } from '@/constants/dragNoteTypes';

interface UseNoteDragProps {
  uuid?: string;
  type: DragNoteTypes;
  noteRef: RefObject<HTMLElement>;
  transformRef?: RefObject<ReactZoomPanPinchRef>;
  xAxis?: number;
  yAxis?: number;
  isNew?: boolean;
  isDisabled?: boolean;
}

export const useNoteDrag = ({
  uuid,
  type,
  noteRef,
  transformRef,
  xAxis = 0,
  yAxis = 0,
  isNew = false,
  isDisabled = false,
}: UseNoteDragProps) => {
  return useDrag(
    () => ({
      type,
      canDrag: !isDisabled,
      item: (monitor) => {
        if (isDisabled) return {};
        const rect = noteRef.current?.getBoundingClientRect();
        const clientOffset = monitor.getClientOffset() || { x: 0, y: 0 };

        if (isNew) {
          const noteWidth = 144;
          const noteHeight = 288;

          const offsetX = clientOffset.x - (rect?.left ?? 0) + noteWidth;
          const offsetY = clientOffset.y - (rect?.top ?? 0) + noteHeight;

          return {
            type,
            offsetX,
            offsetY,
            uuid: Date.now().toLocaleString(),
          };
        }

        const transformState = transformRef?.current?.instance?.transformState;

        if (!transformState || !rect) {
          return {
            uuid,
            xAxis,
            yAxis,
            offsetX: 0,
            offsetY: 0,
          };
        }

        const { scale, positionX, positionY } = transformState;
        const offsetX = (clientOffset.x - rect.left - positionX) / scale;
        const offsetY = (clientOffset.y - rect.top - positionY) / scale;

        return { xAxis, yAxis, offsetX, offsetY, uuid };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [isDisabled],
  );
};
