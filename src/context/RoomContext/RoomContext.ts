import { createContext, useContext } from 'react';

export interface RoomContextType {
  isEnteredInRoom: boolean;
}

export const RoomContext = createContext<RoomContextType>({
  isEnteredInRoom: true,
});

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoomContext must be used within a RoomProvider');
  }
  return context;
};
