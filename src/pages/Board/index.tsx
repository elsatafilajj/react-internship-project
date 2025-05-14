import { useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { DroppableBoard } from '@/components/DroppableBoard';

export const Board = () => {
  const [transformDisabled, setTransformDisabled] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchRef>({} as ReactZoomPanPinchRef);

  return (
    <DndProvider backend={HTML5Backend}>
      <TransformWrapper
        initialScale={1}
        minScale={0.3}
        limitToBounds={true}
        ref={transformRef}
        disabled={transformDisabled}
        centerOnInit={true}
        panning={{ velocityDisabled: true }}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <DroppableBoard
            transformRef={transformRef}
            setTransformDisabled={setTransformDisabled}
          />
        </TransformComponent>
      </TransformWrapper>
    </DndProvider>
  );
};
