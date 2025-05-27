import { useMutation } from '@tanstack/react-query';
import { Circle, MessageSquare, Star, StarOff, X } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Toggle } from '@/components/ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DragNoteTypes } from '@/constants/dragNoteTypes';
import { queryKeys } from '@/constants/queryKeys';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useNoteDrag } from '@/hooks/useNoteDrag';

interface NoteProps extends Partial<NoteItem> {
  setTransformDisabled: (b: boolean) => void;
  transformRef?: RefObject<ReactZoomPanPinchRef>;
}

const colors = [
  { green: 'note-background-green' },
  { yellow: 'note-background-yellow' },
  { pink: 'note-background-pink' },
  { blue: 'note-background-blue' },
  { red: 'note-background-red' },
];

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
  const [noteFillColor, setNoteFillColor] = useState('note-background-pink');

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
      if (localStorage.getItem('votedNote') === uuid) {
        localStorage.removeItem('votedNote');
        localStorage.setItem('hasVoted', 'false');
      }
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
        <Popover>
          <PopoverTrigger>
            <div className="flex relative">
              <div
                className={`w-2xs h-70 ${
                  noteFillColor === 'note-background-green'
                    ? 'bg-note-background-green'
                    : noteFillColor === 'note-background-yellow'
                      ? 'bg-note-background-yellow'
                      : noteFillColor === 'note-background-pink'
                        ? 'bg-note-background-pink'
                        : noteFillColor === 'note-background-blue'
                          ? 'bg-note-background-blue'
                          : noteFillColor === 'note-background-red'
                            ? 'bg-note-background-red'
                            : 'bg-note-background-pink'
                } shadow-sm overflow-hidden rounded-xs}`}
              >
                <div className="flex flex-col justify-between h-full p-2 text-xs">
                  <textarea
                    value={content}
                    onChange={handleNoteContentChange}
                    placeholder="Type in your idea..."
                    className="resize-none p-2 w-full tracking-wide h-full bg-transparent border-none outline-none text-sm text-muted-foreground brightness-25"
                    aria-label="Note input"
                    autoFocus
                  />
                  <span className="text-muted-foreground brightness-50 mt-1 ml-1 tracking-wide text-xs self-start">
                    {user && user.firstName}
                  </span>
                </div>
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent side="top" sideOffset={10}>
            <div className="bg-popover flex items-center justify-between gap-1 rounded-xs h-fit">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <X
                      strokeWidth={2.5}
                      size={20}
                      className="cursor-pointer"
                      onClick={() => deleteMutation.mutateAsync(uuid)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex gap-3 p-3">
                {colors.map((colorObj, i) => {
                  const colorClass = Object.values(colorObj)[0];

                  return (
                    <Circle
                      strokeWidth={2.5}
                      key={i}
                      size={17}
                      className={`text-foreground ${
                        colorClass === 'note-background-green'
                          ? 'fill-note-background-green'
                          : colorClass === 'note-background-yellow'
                            ? 'fill-note-background-yellow'
                            : colorClass === 'note-background-pink'
                              ? 'fill-note-background-pink'
                              : colorClass === 'note-background-blue'
                                ? 'fill-note-background-blue'
                                : colorClass === 'note-background-red'
                                  ? 'fill-note-background-red'
                                  : ''
                      } cursor-pointer`}
                      onClick={() => setNoteFillColor(colorClass)}
                    />
                  );
                })}
              </div>

              <div className="flex relative flex-col items-center  mr-2">
                <Toggle
                  variant="ghost"
                  size="lg"
                  className="cursor-pointer"
                  onClick={handleVote}
                  disabled={
                    !!hasVoted && localStorage.getItem('votedNote') !== uuid
                  }
                >
                  {hasVoted === true &&
                  localStorage.getItem('votedNote') === uuid ? (
                    <StarOff strokeWidth={2.5} />
                  ) : (
                    <Star strokeWidth={2.5} />
                  )}
                </Toggle>
                <p className="text-xs absolute font-semibold -top-1.5 ">
                  {totalVotes || totalVotes === 0 ? totalVotes : 15}
                </p>
              </div>
              <MessageSquare
                strokeWidth={2.5}
                className="self-center hover:cursor-pointer"
                size={20}
              />
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
