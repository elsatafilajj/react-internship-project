import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { NoteItem } from '@/api/Note/note.types';
import { useGetAllNotesFromRoomQuery } from '@/api/Note/notes.queries';
import { DraggableNote } from '@/components/DraggableNote';
import { DragNoteTypes } from '@/constants/dragNoteTypes';
import { queryKeys } from '@/constants/queryKeys';
import { RouteNames } from '@/constants/routeNames';
import { socketEvents } from '@/constants/socketEvents';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { getSocket } from '@/helpers/socket';
import { useNoteDrop } from '@/hooks/useNoteDrop';
import { useRoomStatus } from '@/hooks/useRoomStatus';

interface DroppableRoomProps {
  setTransformDisabled: (b: boolean) => void;
  transformRef: React.RefObject<ReactZoomPanPinchRef>;
}

export const DroppableRoom = ({
  transformRef,
  setTransformDisabled,
}: DroppableRoomProps) => {
  const [notes, setNotes] = useState<Partial<NoteItem>[]>([]);
  const roomRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const { roomId } = useParams<{ roomId: string }>();
  const { data, isFetched } = useGetAllNotesFromRoomQuery(roomId || '');
  const { isRoomArchived } = useRoomStatus();
  const socket = useMemo(() => getSocket(), []);
  const navigate = useNavigate();

  useEffect(() => {
    if (isFetched && data) {
      setNotes(data?.data);
    }
  }, [data, isFetched]);

  const moveDropRef = useNoteDrop({
    type: DragNoteTypes.Note,
    roomRef,
    transformRef,
    onDrop: (x, y, uuid) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.uuid === uuid ? { ...note, xAxis: x, yAxis: y } : note,
        ),
      );

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
    if (isFetched && data) {
      setNotes(data?.data);
    }
  }, [data, isFetched]);

  useEffect(() => {
    if (!socket) return;

    socket.on(socketEvents.CreatedNote, (newNote) => {
      setNotes((prevNotes) => [...(prevNotes || ''), newNote]);
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNotesByRoomId(roomId || ''),
      });
    });

    socket.on(socketEvents.UpdatedNote, (updatedNote) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.uuid === updatedNote.uuid ? { ...note, ...updatedNote } : note,
        ),
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNotesByRoomId(roomId || ''),
      });
    });

    socket.on(socketEvents.AddedVote, (newVote) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNotesByRoomId(roomId || ''),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNoteVotes(newVote.switchedFrom || ''),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNoteVotes(newVote.addedTo || ''),
      });
    });

    socket.on(socketEvents.RemovedVote, (removedVote) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNotesByRoomId(roomId || ''),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNoteVotes(removedVote.removedFrom || ''),
      });
    });

    socket.on(socketEvents.DeletedNote, (deletedNote) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNotesByRoomId(roomId || ''),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.getNoteVotes(deletedNote.resourceId || ''),
      });
    });

    socket.on(socketEvents.ArchivedRoom, ({ roomId: archivedRoomId }) => {
      if (archivedRoomId === roomId) {
        navigate(RouteNames.ArchivedRooms);
      }
    });

    socket.on(socketEvents.DeletedRoom, (deleted) => {
      toast.success(deleted.message || 'Room deleted successfully!');
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleRoom(roomId || ''),
      });
      navigate(RouteNames.Rooms);
    });

    socket.on(socketEvents.UserJoined, () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getUsers(),
      });
    });

    socket.on(socketEvents.UserRemove, ({ userId }) => {
      if (userId === user?.uuid) {
        toast.error("You've been removed from this room.");
        navigate(RouteNames.Rooms);
      }
    });

    socket.on(socketEvents.RoomLeftP, () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getUsers(),
      });
    });

    socket.on(socketEvents.JoinedRoom, () => {});

    return () => {
      socket.off(socketEvents.CreatedNote);
      socket.off(socketEvents.UpdatedNote);
      socket.off(socketEvents.AddedVote);
      socket.off(socketEvents.RemovedVote);
      socket.off(socketEvents.DeletedNote);
      socket.off(socketEvents.ArchivedRoom);
      socket.off(socketEvents.UpdatedRoom);
      socket.off(socketEvents.DeletedRoom);
      socket.off(socketEvents.UserRemove);
      socket.off(socketEvents.RoomLeftP);
      socket.off(socketEvents.JoinedRoom);
    };
  }, []);

  moveDropRef(roomRef);
  addDropRef(roomRef);

  return (
    <div
      id="room"
      ref={roomRef}
      className="w-[5000px] h-[2813px] relative bg-dot-grid overflow-hidden   p-8 rounded-lg"
    >
      {notes?.map((note: Partial<NoteItem>) => (
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
