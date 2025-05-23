import { useMutation } from '@tanstack/react-query';
import { Palette, Star, StarOff, X } from 'lucide-react';
import { ChangeEvent, RefObject, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { queryClient } from '@/App';
import {
  addVoteToNote,
  deleteNote,
  removeVoteFromNote,
  updateNote,
} from '@/api/Note/note.client';
import { NoteItem, UpdateNoteInput } from '@/api/Note/note.types';
import { Toggle } from '@/components/ui/toggle';
import { DragNoteTypes } from '@/constants/dragNoteTypes';
import { queryKeys } from '@/constants/queryKeys';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useNoteDrag } from '@/hooks/useNoteDrag';

interface NoteProps extends Partial<NoteItem> {
  setTransformDisabled: (b: boolean) => void;
  transformRef?: RefObject<ReactZoomPanPinchRef>;
}

export const DraggableNote = ({
  uuid,
  xAxis,
  yAxis,
  totalVotes,
  setTransformDisabled,
  transformRef,
}: NoteProps) => {
  const noteRef = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useNoteDrag({
    uuid,
    type: DragNoteTypes.Note,
    noteRef,
    transformRef,
    xAxis,
    yAxis,
  });
  drag(noteRef);

  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuthContext();

  const [hasVoted, setHasVoted] = useState<boolean | null>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    const votedNote = localStorage.getItem('votedNote');
    setHasVoted(votedNote === uuid);
  }, [uuid]);

  const queryKey = queryKeys.getNotesByRoomId(roomId || '');

  const updateNoteMutation = useMutation({
    mutationFn: ({
      noteId,
      data,
    }: {
      noteId: NoteItem['uuid'];
      data: UpdateNoteInput;
    }) => updateNote(noteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update note.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => deleteNote(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Your note has been deleted!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete note.');
    },
  });

  const addVoteMutation = useMutation({
    mutationFn: (uuid: NoteItem['uuid']) => addVoteToNote(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
      toast.success('Your vote has been registered!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to register your vote.');
    },
  });

  const removeVoteMutation = useMutation({
    mutationFn: (uuid: NoteItem['uuid']) => removeVoteFromNote(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
      toast.success('Your vote has been removed!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to remove vote.');
    },
  });

  const debouncedContent: string = useDebounce(content, 3000);

  useEffect(() => {
    if (uuid) {
      const updatedNote = { content: debouncedContent };
      if (debouncedContent != content) {
        updateNoteMutation.mutateAsync({
          noteId: uuid,
          data: updatedNote,
        });
      }
    }
  }, [debouncedContent, uuid]);

  const handleNoteContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleVote = () => {
    const votedNote = localStorage.getItem('votedNote');

    if (votedNote && votedNote !== uuid) {
      toast.error('You have already voted on another note.');
      return;
    }

    if (votedNote === uuid) {
      removeVoteMutation.mutateAsync(uuid);

      localStorage.removeItem('votedNote');
      localStorage.setItem('hasVoted', 'false');
      setHasVoted(false);
    } else if (uuid) {
      addVoteMutation.mutateAsync(uuid);

      localStorage.setItem('votedNote', uuid);
      localStorage.setItem('hasVoted', 'true');
      setHasVoted(true);
    }
  };

  return (
    <div
      ref={noteRef}
      style={{
        position: 'absolute',
        left: xAxis,
        top: yAxis,
        opacity: isDragging ? 0 : 1,
      }}
      onMouseDown={() => setTransformDisabled(true)}
      onDragEnd={() => setTransformDisabled(false)}
      onMouseUp={() => setTransformDisabled(false)}
    >
      {uuid && (
        <div className="flex relative">
          <div className="w-2xs h-70 bg-note-background-pink shadow-sm overflow-hidden rounded-xs">
            <div className="flex flex-col justify-between h-full p-2 text-xs">
              <div className="absolute bg-card -right-12 top-0 flex flex-col items-center p-2 px-1.5 gap-1.5 rounded-xs h-fit">
                <X
                  strokeWidth={1.5}
                  size={20}
                  className="cursor-pointer"
                  onClick={() => deleteMutation.mutateAsync(uuid)}
                />
                <Palette
                  className="cursor-pointer"
                  size={18}
                  strokeWidth={1.5}
                />

                <div className="flex flex-col items-center gap-0">
                  <Toggle
                    size="sm"
                    className="p-0.2 w-1 cursor-pointer"
                    onClick={handleVote}
                    disabled={
                      !!hasVoted && localStorage.getItem('votedNote') !== uuid
                    }
                  >
                    {hasVoted === true &&
                    localStorage.getItem('votedNote') === uuid ? (
                      <StarOff size={30} strokeWidth={1.5} />
                    ) : (
                      <Star size={30} strokeWidth={1.5} />
                    )}
                  </Toggle>
                  <p className="text-[0.5rem] text-muted-foreground">
                    {totalVotes || totalVotes === 0 ? totalVotes : 15}
                  </p>
                </div>
              </div>

              <textarea
                value={content}
                onChange={handleNoteContentChange}
                placeholder="Type in your idea...                             ⚡"
                className="resize-none p-2 w-full tracking-wide h-full bg-transparent border-none outline-none text-sm text-muted-foreground brightness-25"
                aria-label="Note input"
                autoFocus
              />
              <span className="text-muted-foreground brightness-50 mt-1 ml-1 tracking-wide text-xs">
                {user && user.firstName}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
