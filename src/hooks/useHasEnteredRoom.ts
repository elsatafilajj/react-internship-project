import { useParams } from 'react-router-dom';

export const useHasEnteredRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();

  return Boolean(roomId);
};
