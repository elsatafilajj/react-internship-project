import { useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { NoteItem } from '@/api/Note/note.types';
import { useGetAllNotesFromRoomQuery } from '@/api/Note/notes.queries';
import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { DraggableNote } from '@/components/DraggableNote';
import { DragNoteTypes } from '@/constants/dragNoteTypes';
import { queryKeys } from '@/constants/queryKeys';
import { socketEvents } from '@/constants/socketEvents';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { getSocket } from '@/helpers/socket';
import { useNoteDrop } from '@/hooks/useNoteDrop';
import { useRoomStatus } from '@/hooks/useRoomStatus';
import { useViewportBounds } from '@/hooks/useViewportBounds';
import { ErrorResponseData } from '@/types/ErrorResponse';

interface DroppableRoomProps {
  setTransformDisabled: (b: boolean) => void;
  transformRef: React.RefObject<ReactZoomPanPinchRef>;
}

export const DroppableRoom = ({
  transformRef,
  setTransformDisabled,
}: DroppableRoomProps) => {
  const queryClient = useQueryClient();
  const roomRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuthContext();
  const { roomId } = useParams<{ roomId: string }>();

  const bounds = useViewportBounds();

  const { data } = useGetAllNotesFromRoomQuery(
    roomId || '',
    bounds?.xMin ?? 0,
    bounds?.yMin ?? 0,
    bounds?.xMax ?? 0,
    bounds?.yMax ?? 0,
  );

  const socket = useMemo(() => getSocket(), []);

  const navigate = useNavigate();
  const { isRoomArchived } = useRoomStatus();

  const { error } = useGetRoomByIdQuery(roomId || '');

  useEffect(() => {
    if (!error) return;
    const axiosError = error as AxiosError<ErrorResponseData>;

    const status = axiosError?.response?.status;

    if (!status) return;

    if ([403, 404, 500].includes(status)) {
      const message =
        axiosError.response?.data?.message ??
        'You were removed from this room.';
      toast.error(message);
      navigate('/rooms');
    } else if (status >= 400 && status < 600) {
      const message =
        axiosError.response?.data?.message ??
        'Something went wrong. Please try again.';
      toast.error(message);
    }
  }, [error, navigate]);

  useEffect(() => {
    if (
      roomId &&
      bounds?.xMin !== undefined &&
      bounds?.yMin !== undefined &&
      bounds?.xMax !== undefined &&
      bounds?.yMax !== undefined
    ) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNotesByRoomId(
          roomId,
          bounds.xMin,
          bounds.yMin,
          bounds.xMax,
          bounds.yMax,
        ),
      });
    }
  }, [bounds?.previousScale]);

  const moveDropRef = useNoteDrop({
    type: DragNoteTypes.Note,
    roomRef,
    transformRef,
    onDrop: (x, y, uuid) => {
      socket.emit(socketEvents.UpdateNote, {
        roomId,
        noteId: uuid,
        updates: {
          xAxis: Math.floor(x),
          yAxis: Math.floor(y),
        },
      });
    },
  });

  const addDropRef = useNoteDrop({
    type: DragNoteTypes.NewNote,
    roomRef,
    transformRef,

    onDrop: (x, y) => {
      socket.emit(socketEvents.CreateNote, {
        roomId,
        xAxis: Math.floor(x),
        yAxis: Math.floor(y),
      });
    },
  });

  useEffect(() => {
    if (!socket) return;

    socket.on(socketEvents.CreatedNote, (newNote) => {
      console.log('new note', newNote);
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleNote(newNote.uuid || ''),
      });
    });

    socket.on(socketEvents.UpdatedNote, (updatedNote) => {
      console.log('updated note: ', updatedNote);
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleNote(updatedNote.uuid),
      });

      queryClient.setQueryData(
        queryKeys.getNotesByRoomId(
          roomId || '',
          bounds?.xMin,
          bounds?.yMin,
          bounds?.xMax,
          bounds?.yMax,
        ),
        (oldData: AxiosResponse<NoteItem[]> | undefined) => {
          if (!oldData) return;

          const updatedNotes = oldData.data.map((note) =>
            note.uuid === updatedNote.uuid ? { ...note, ...updatedNote } : note,
          );

          return {
            ...oldData,
            data: updatedNotes,
          };
        },
      );
    });

    socket.on(socketEvents.AddedVote, (newVote) => {
      console.log('new vote', newVote);
      queryClient.invalidateQueries({
        queryKey: [
          queryKeys.getNoteVotes(newVote.switchedFrom),
          queryKeys.getNoteVotes(newVote.addedTo),
        ],
      });
    });

    socket.on(socketEvents.RemovedVote, (removedVote) => {
      console.log('removed note', removedVote);
      queryClient.invalidateQueries({
        queryKey: [
          queryKeys.getNoteVotes(removedVote.switchedFrom),
          queryKeys.getNoteVotes(removedVote.addedTo),
        ],
      });
    });

    socket.on(socketEvents.DeletedNote, (deletedNote) => {
      console.log('note deleted', deletedNote);
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleNote(deletedNote.uuid),
      });
    });

    socket.on(socketEvents.ArchivedRoom, ({ roomId: archivedRoomId }) => {
      if (archivedRoomId === roomId) {
        navigate('/rooms/archived');
      }
    });

    socket.on(socketEvents.UserJoined, ({ userId }) => {
      console.log(userId, `joined the room`);
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleUser(userId),
      });
    });

    socket.on(socketEvents.UserRemove, ({ userId }) => {
      if (userId === user?.uuid) {
        toast.error("You've been removed from this room.");
        navigate('/rooms');
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleUser(userId),
      });
    });

    socket.on(socketEvents.RoomLeftP, ({ userId }) => {
      console.log(`${userId.id} left the room`);

      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleUser(userId.id),
      });
    });

    return () => {
      socket.off(socketEvents.CreatedNote);
      socket.off(socketEvents.UpdatedNote);
      socket.off(socketEvents.AddedVote);
      socket.off(socketEvents.RemovedVote);
      socket.off(socketEvents.DeletedNote);
      socket.off(socketEvents.ArchivedRoom);
      socket.off(socketEvents.UserRemove);
      socket.off('rooms/leftP');
    };
  }, []);

  moveDropRef(roomRef);
  addDropRef(roomRef);

  return (
    <div
      id="room"
      ref={roomRef}
      className="w-[5000px] h-[2813px] relative bg-dot-grid overflow-hidden p-8 rounded-lg"
    >
      {data &&
        data.data &&
        data.data?.map((note: Partial<NoteItem>) => (
          <DraggableNote
            key={note.uuid}
            note={note}
            setTransformDisabled={setTransformDisabled}
            transformRef={transformRef}
            isReadOnly={isRoomArchived}
          />
        ))}
    </div>
  );
};
