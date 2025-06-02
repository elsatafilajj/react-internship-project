import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { createNewNote, updateNote } from '@/api/Note/note.client';
import {
  CreateNoteInput,
  NoteItem,
  UpdateNoteInput,
} from '@/api/Note/note.types';
import { useGetAllNotesFromRoomQuery } from '@/api/Note/notes.queries';
import { DraggableNote, ErrorResponseData } from '@/components/DraggableNote';
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
  const queryClient = useQueryClient();

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
    onError: (error: AxiosError) => {
      const responseData = error.response?.data as ErrorResponseData;
      toast.error(responseData.message || 'Failed to update note');
    },
  });

  const createNewNoteMutation = useMutation({
    mutationFn: (data: CreateNoteInput) => createNewNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNotesByRoomId(roomId || ''),
      });
    },
    onError: (error: AxiosError) => {
      const responseData = error.response?.data as ErrorResponseData;
      toast.error(responseData.message || 'Failed to create new note');
    },
  });

  const moveDropRef = useNoteDrop({
    type: DragNoteTypes.Note,
    roomRef,
    transformRef,
    onDrop: (x, y, uuid) => {
      const updatedNote = {
        xAxis: Number(Math.floor(x)),
        yAxis: Number(Math.floor(y)),
      };

      if (!uuid) return;

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
    onDrop: (x, y) => {
      if (roomId) {
        const newNote = {
          roomId,
          xAxis: Number(Math.floor(x)),
          yAxis: Number(Math.floor(y)),
        };
        createNewNoteMutation.mutateAsync(newNote);
      }

      setNotes((prevNotes) => [...(prevNotes || []), { xAxis: x, yAxis: y }]);
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
          content={note.content}
          xAxis={note.xAxis}
          yAxis={note.yAxis}
          authorName={note.author?.firstName}
          totalVotes={note.totalVotes}
          color={note.color}
          noteVotes={note.noteVotes}
          setTransformDisabled={setTransformDisabled}
          transformRef={transformRef}
        />
      ))}
    </div>
  );
};
