import { useParams } from 'react-router-dom';

import { useGetAllNotesFromRoomQuery } from '@/api/Note/notes.queries';
import { Note } from '@/components/Note';

export const RoomDetails = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const {
    data: notes,
    isLoading,
    isError,
    error,
  } = useGetAllNotesFromRoomQuery(roomId || '');

  console.log('test', notes);

  if (isLoading)
    return <p className="text-center mt-10 text-gray-600">Loading notes...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">
        Error: {(error as Error).message}
      </p>
    );

  return <div>{notes?.data.map((note) => <Note key={note.uuid} />)}</div>;
};
