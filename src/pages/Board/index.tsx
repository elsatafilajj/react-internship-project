import { useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { DroppableBoard } from '@/components/DroppableBoard';
import { ToolPalette } from '@/components/ToolPalette';

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
        disablePadding={true}
        centerOnInit={true}
        panning={{ velocityDisabled: true }}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <DroppableBoard
            transformRef={transformRef}
            setTransformDisabled={setTransformDisabled}
          />
        </TransformComponent>
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <ToolPalette />
        </div>
      </TransformWrapper>
    </DndProvider>
  );
};
