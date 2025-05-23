import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { queryClient } from '@/App';
import { createNewNote, updateNote } from '@/api/Note/note.client';
import {
  CreateNoteInput,
  NoteItem,
  UpdateNoteInput,
} from '@/api/Note/note.types';
import { useGetAllNotesFromRoomQuery } from '@/api/Note/notes.queries';
import { DraggableNote } from '@/components/DraggableNote';
import { DragNoteTypes } from '@/constants/dragNoteTypes';
import { queryKeys } from '@/constants/queryKeys';
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
  const { roomId } = useParams<{ roomId: string }>();

  const { data, isSuccess } = useGetAllNotesFromRoomQuery(roomId || '');
  const [notes, setNotes] = useState<Partial<NoteItem>[]>([]);

  useEffect(() => {
    if (isSuccess && data) {
      setNotes(data.data);
    }
  }, [data, isSuccess]);

  const updateNoteMutation = useMutation({
    mutationFn: ({
      uuid,
      data,
    }: {
      uuid: NoteItem['uuid'];
      data: UpdateNoteInput;
    }) => updateNote(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNotesByRoomId(roomId || ''),
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createNewNoteMutation = useMutation({
    mutationFn: (data: CreateNoteInput) => createNewNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNotesByRoomId(roomId || ''),
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const moveDropRef = useNoteDrop({
    type: DragNoteTypes.Note,
    roomRef,
    transformRef,

    onDrop: (uuid, x, y) => {
      const updatedNote = {
        xAxis: Number(x.toFixed()),
        yAxis: Number(y.toFixed()),
      };

      updateNoteMutation.mutateAsync({ uuid, data: updatedNote });

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.uuid === uuid ? { ...note, xAxis: x, yAxis: y } : note,
        ),
      );
    },
  });

  const addDropRef = useNoteDrop({
    type: DragNoteTypes.NewNote,
    roomRef,
    transformRef,
    onDrop: (uuid, x, y) => {
      if (roomId) {
        const newNote = {
          roomId,
          xAxis: Number(x.toFixed()),
          yAxis: Number(y.toFixed()),
        };
        createNewNoteMutation.mutateAsync(newNote);
      }
      setNotes((prev) => [...(prev || []), { uuid, xAxis: x, yAxis: y }]);
    },
  });

  moveDropRef(roomRef);
  addDropRef(roomRef);

  return (
    <div
      id="room"
      ref={roomRef}
      className="w-[5000px] h-[5000px] relative bg-gradient-to-br from-[var(--color-background-from)] to-[var(--color-background-to)] p-8 rounded-lg"
    >
      {notes?.map((note: Partial<NoteItem>) => (
        <DraggableNote
          key={note.uuid}
          uuid={note.uuid}
          xAxis={note.xAxis}
          yAxis={note.yAxis}
          totalVotes={note.totalVotes}
          setTransformDisabled={setTransformDisabled}
          transformRef={transformRef}
        />
      ))}
    </div>
  );
};
