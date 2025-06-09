import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';

import { RoomContext } from '@/context/RoomContext/RoomContext';

interface RoomContextProviderProps {
  children: ReactNode;
}

const RoomContextProvider = ({ children }: RoomContextProviderProps) => {
  const { roomId } = useParams<{ roomId: string }>();
  const isEnteredInRoom = Boolean(roomId);
  const roomContext = { isEnteredInRoom };

  return (
    <RoomContext.Provider value={roomContext}>{children}</RoomContext.Provider>
  );
};

export default RoomContextProvider;
