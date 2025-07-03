import { useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useEffect, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { NoteItem } from '@/api/Note/note.types';
import { useGetAllNoteIdsFromRoomQuery } from '@/api/Note/notes.queries';
import { DraggableNote } from '@/components/DraggableNote';
import { DragNoteTypes } from '@/constants/dragNoteTypes';
import { queryKeys } from '@/constants/queryKeys';
import { socketEvents } from '@/constants/socketEvents';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { getSocket } from '@/helpers/socket';
import { useNoteDrop } from '@/hooks/useNoteDrop';
import { useRoomStatus } from '@/hooks/useRoomStatus';
import { useViewportBounds } from '@/hooks/useViewportBounds';

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
  const boundsRef = useRef(bounds);

  const { data } = useGetAllNoteIdsFromRoomQuery(
    roomId || '',
    bounds?.xMin ?? 0,
    bounds?.yMin ?? 0,
    bounds?.xMax ?? 0,
    bounds?.yMax ?? 0,
  );

  useEffect(() => {
    queryClient.refetchQueries({
      queryKey: queryKeys.getNoteIdsByRoomId(roomId || ''),
    });
  }, [bounds?.scale, bounds?.xMin, bounds?.yMin]);

  useEffect(() => {
    boundsRef.current = bounds;
  }, [bounds]);

  const socket = useMemo(() => getSocket(), []);

  const navigate = useNavigate();
  const { isRoomArchived } = useRoomStatus();

  const moveDropRef = useNoteDrop({
    type: DragNoteTypes.Note,
    roomRef,
    transformRef,
    onDrop: (x, y, uuid) => {
      const xAxis = Math.floor(x);
      const yAxis = Math.floor(y);

      queryClient.setQueryData(
        queryKeys.getSingleNote(uuid || ''),
        (oldData: AxiosResponse | undefined) => {
          if (!oldData?.data) return oldData?.data;

          return { ...oldData?.data, xAxis, yAxis };
        },
      );

      queryClient.setQueryData(
        queryKeys.getNoteIdsByRoomId(roomId || ''),
        (oldData: AxiosResponse | undefined) => {
          if (!oldData?.data) return oldData?.data;

          return {
            ...oldData,
            data: oldData?.data?.map((note: NoteItem) =>
              note.uuid === uuid ? { ...note, xAxis, yAxis } : note,
            ),
          };
        },
      );

      socket.emit(socketEvents.UpdateNote, {
        roomId,
        noteId: uuid,
        updates: {
          xAxis,
          yAxis,
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
      queryClient.setQueryData(queryKeys.getSingleNote(newNote.uuid), () => {
        return newNote;
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNoteIdsByRoomId(roomId || ''),
      });
    });

    socket.on(socketEvents.UpdatedNote, (updatedNote) => {
      queryClient.refetchQueries({
        queryKey: queryKeys.getSingleNote(updatedNote.uuid),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNoteIdsByRoomId(roomId || ''),
      });
    });

    socket.on(socketEvents.DeletedNote, (deletedNote) => {
      queryClient.removeQueries({
        queryKey: queryKeys.getSingleNote(deletedNote.resourceId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNoteIdsByRoomId(roomId || ''),
      });
    });

    socket.on(socketEvents.AddedVote, (newVote) => {
      console.log('add vote', newVote);

      queryClient.invalidateQueries({
        queryKey: queryKeys.getNoteIdsByRoomId(roomId || ''),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNoteVotes(newVote.switchedFrom),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNoteVotes(newVote.addedTo),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleNote(newVote.switchedFrom),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleNote(newVote.addedTo),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getWinnerNotes(roomId || ''),
      });
    });

    socket.on(socketEvents.RemovedVote, (removedVote) => {
      console.log(removedVote);
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNoteIdsByRoomId(roomId || ''),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.getNoteVotes(removedVote.removedFrom),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNoteVotes(removedVote.addedTo),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleNote(removedVote.switchedFrom),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleNote(removedVote.addedTo),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getWinnerNotes(roomId || ''),
      });
      // queryClient.removeQueries({
      //   queryKey: queryKeys.getNoteVotes(removedVote.resourceId || ''),
      // });
    });

    socket.on(socketEvents.ArchivedRoom, ({ roomId: archivedRoomId }) => {
      if (archivedRoomId === roomId) {
        navigate('/rooms/archived');
      }
    });

    socket.on(socketEvents.DeletedRoom, (deleted) => {
      toast.success(deleted.message || 'Room deleted successfully!');
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleRoom(roomId || ''),
      });
      navigate('/rooms');
    });

    socket.on(socketEvents.UserJoined, ({ userId }) => {
      console.log(userId, `joined the room`);
      queryClient.invalidateQueries({
        queryKey: queryKeys.getUsers(),
      });
    });

    socket.on(socketEvents.UserRemove, ({ userId }) => {
      if (userId === user?.uuid) {
        toast.error("You've been removed from this room.");
        navigate('/rooms');
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.getUsers(),
      });
    });

    socket.on(socketEvents.RoomLeftP, ({ userId }) => {
      console.log(`${userId.id} left the room`);

      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleUser(userId.id),
      });
    });

    return () => {
      Object.values(socketEvents).forEach((eventName) => socket.off(eventName));
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
