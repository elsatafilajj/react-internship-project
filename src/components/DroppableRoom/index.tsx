import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { NoteItem } from '@/api/Note/note.types';
import { useGetAllNotesFromRoomQuery } from '@/api/Note/notes.queries';
import { DraggableNote } from '@/components/DraggableNote';
import { DragNoteTypes } from '@/constants/dragNoteTypes';
import { queryKeys } from '@/constants/queryKeys';
import { socketEvents } from '@/constants/socketEvents';
import { getSocket } from '@/helpers/socket';
import { useNoteDrop } from '@/hooks/useNoteDrop';

interface DroppableRoomProps {
  setTransformDisabled: (b: boolean) => void;
  transformRef: React.RefObject<ReactZoomPanPinchRef>;
}

export const DroppableRoom = ({
  transformRef,
  setTransformDisabled,
}: DroppableRoomProps) => {
  const roomRef = useRef<HTMLDivElement | null>(null);

  const [notes, setNotes] = useState<Partial<NoteItem>[]>([]);

  const queryClient = useQueryClient();

  const { roomId } = useParams<{ roomId: string }>();

  const { data, isFetched } = useGetAllNotesFromRoomQuery(roomId || '');

  const socket = useMemo(() => getSocket(), []);

  useEffect(() => {
    if (isFetched && data) {
      setNotes(data.data);
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
      setNotes(data.data);
    }
  }, [data, isFetched]);

  useEffect(() => {
    if (!socket) return;

    socket.on(socketEvents.CreatedNote, (newNote) => {
      console.log('new note', newNote);
      setNotes((prev) => [...(prev || []), newNote]);
    });

    socket.on(socketEvents.UpdatedNote, (data) => {
      const { uuid, xAxis, yAxis, content, color } = data;
      setNotes((prev) =>
        prev.map((note) =>
          note.uuid === uuid ? { ...note, xAxis, yAxis, content, color } : note,
        ),
      );
    });

    socket.on(socketEvents.AddedVote, (newVote) => {
      console.log('new vote', newVote);
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNotesByRoomId(roomId || ''),
      });
    });

    socket.on(socketEvents.RemovedVote, (removedVote) => {
      console.log('removed note', removedVote);
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNotesByRoomId(roomId || ''),
      });
    });

    socket.on(socketEvents.DeletedNote, (deletedNote) => {
      console.log('note deleted', deletedNote);
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNotesByRoomId(roomId || ''),
      });
    });

    return () => {
      socket.off(socketEvents.CreatedNote);
      socket.off(socketEvents.UpdatedNote);
      socket.off(socketEvents.AddedVote);
      socket.off(socketEvents.RemovedVote);
      socket.off(socketEvents.DeletedNote);
    };
  }, []);

  moveDropRef(roomRef);
  addDropRef(roomRef);

  return (
    <div
      id="room"
      ref={roomRef}
      className="w-[5000px] h-[2813px] relative bg-gradient-to-br from-[var(--color-background-from)] to-[var(--color-background-to)] p-8 rounded-lg"
    >
      {notes?.map((note: Partial<NoteItem>) => (
        <DraggableNote
          key={note.uuid}
          note={note}
          setTransformDisabled={setTransformDisabled}
          transformRef={transformRef}
        />
      ))}
    </div>
  );
};
