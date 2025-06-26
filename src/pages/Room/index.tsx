import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { ActivityPanelToggle } from '@/components/ActivityPanel/Toggle';
import { DroppableRoom } from '@/components/DroppableRoom';
import { ToolPalette } from '@/components/ToolPalette';
import { queryKeys } from '@/constants/queryKeys';
import { socketEvents } from '@/constants/socketEvents';
import { getSocket } from '@/helpers/socket';

export const Room = () => {
  const [transformDisabled, setTransformDisabled] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchRef>({} as ReactZoomPanPinchRef);
  const { roomId } = useParams<{ roomId: string }>();
  const socket = useMemo(() => getSocket(), []);
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  useEffect(() => {
    if (!roomId) return;

    localStorage.setItem('lastRoomId', roomId);

    const uuidRegex = /^[0-9a-fA-F-]{36}$/;
    const isUuidValid = uuidRegex.test(roomId);
    if (!isUuidValid) navigate('/rooms');
  }, [roomId]);

  console.log('roomId from localStorage:', localStorage.getItem('lastRoomId'));

  useEffect(() => {
    if (!roomId) return;

    socket.emit(socketEvents.JoinRoom, { roomId });
    queryClient.invalidateQueries({
      queryKey: queryKeys.getSingleRoom(roomId || ''),
    });
    toast.success('You joined the room');

    return () => {
      socket.emit(socketEvents.LeaveRoom, { roomId });
      toast.success('You left the room');
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleRoom(roomId || ''),
      });
    };
  }, [roomId]);

  return (
    <DndProvider backend={HTML5Backend}>
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        limitToBounds={true}
        ref={transformRef}
        disabled={transformDisabled}
        disablePadding={true}
        centerOnInit={true}
        panning={{ velocityDisabled: true }}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <DroppableRoom
            transformRef={transformRef}
            setTransformDisabled={setTransformDisabled}
          />
        </TransformComponent>

        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <ToolPalette setTransformDisabled={setTransformDisabled} />
        </div>

        <div className="fixed z-50">
          <ActivityPanelToggle />
        </div>
      </TransformWrapper>
    </DndProvider>
  );
};
