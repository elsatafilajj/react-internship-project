import { useParams } from 'react-router-dom';

export const useRoomEnteredCheck = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const isEnteredInRoom = Boolean(roomId);
  return isEnteredInRoom;
};
