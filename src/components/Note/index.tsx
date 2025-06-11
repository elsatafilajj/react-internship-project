import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Circle, Star, X } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import {
  addVoteToNote,
  deleteNote,
  removeVoteFromNote,
  updateNote,
} from '@/api/Note/note.client';
import { NoteItem, UpdateNoteInput } from '@/api/Note/note.types';
import { PanelToggle } from '@/components/CommentsPanel/PanelToggle';
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
import { queryKeys } from '@/constants/queryKeys';
import { socketEvents } from '@/constants/socketEvents';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { getSocket } from '@/helpers/socket';
import { useDebounce } from '@/hooks/useDebounce';

interface NoteProps {
  note: Partial<NoteItem>;
}

export type ErrorResponseData = {
  statusCode: number;
  message: string;
  error: string;
};

const fillColors = [
  'note-background-green',
  'note-background-yellow',
  'note-background-pink',
  'note-background-blue',
  'note-background-red',
] as const;

const noteColorClassMap = {
  'note-background-green': `bg-note-background-green`,
  'note-background-yellow': `bg-note-background-yellow`,
  'note-background-pink': `bg-note-background-pink`,
  'note-background-blue': `bg-note-background-blue`,
  'note-background-red': `bg-note-background-red`,
} as const;

export const Note = ({ note }: NoteProps) => {
  const socket = getSocket();
  const { roomId } = useParams<{ roomId: string }>();

  const { uuid, content, author } = note;
  const [noteContent, setNoteContent] = useState('');

  const [localNoteColor, setLocalNoteColor] = useState<string>(
    note.color || 'note-background-green',
  );

  const queryClient = useQueryClient();
  const queryKey = queryKeys.getNotesByRoomId(roomId || '');

  const { user } = useAuthContext();
  const isUserVoter = note.noteVotes?.find(
    (item) => item.user.uuid === user?.uuid,
  );
  const [hasVoted, setHasVoted] = useState<boolean | null>(
    !!isUserVoter || null,
  );

  const debouncedContent: string = useDebounce(noteContent, 1000);

  useEffect(() => {
    if (content) {
      setNoteContent(content);
    }
  }, [content]);

  useEffect(() => {
    socket.emit(socketEvents.UpdateNote, {
      roomId,
      noteId: uuid,
      updates: { content: debouncedContent },
    });
  }, [debouncedContent]);

  const handleNoteContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(event.target.value);
  };

  const handleNoteColorChange = (noteColor: string) => {
    setLocalNoteColor(noteColor);
    if (!uuid) return;
    updateNoteMutation.mutateAsync({
      uuid,
      data: { color: noteColor },
    });
  };

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => deleteNote(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Your note has been deleted!');
    },
    onError: (error: AxiosError) => {
      const responseData = error.response?.data as ErrorResponseData;
      toast.error(responseData.message || 'Failed to delete note.');
    },
  });

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
      toast.error(responseData.message || 'Failed to update note.');
    },
  });

  const addVoteMutation = useMutation({
    mutationFn: (uuid: NoteItem['uuid']) => addVoteToNote(uuid),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey,
      });
      const voteResponse = response?.data;
      if (voteResponse.voteSwitched) {
        toast.success('Your vote has been switched!');
      } else {
        toast.success('Your vote has been registered!');
      }
      setHasVoted(true);
    },
    onError: (error: AxiosError) => {
      const responseData = error.response?.data as ErrorResponseData;
      toast.error(responseData.message || 'Failed to register your vote.');
    },
  });

  const removeVoteMutation = useMutation({
    mutationFn: (uuid: NoteItem['uuid']) => removeVoteFromNote(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
      toast.success('Your vote has been removed!');
      setHasVoted(false);
    },
    onError: (error: AxiosError) => {
      const responseData = error.response?.data as ErrorResponseData;
      toast.error(responseData.message || 'Failed to remove vote.');
    },
  });

  const handleVote = async () => {
    if (!uuid) return;
    if (hasVoted && !!isUserVoter) {
      removeVoteMutation.mutateAsync(uuid);
    } else if (uuid) {
      addVoteMutation.mutateAsync(uuid);
    }
  };

  return (
    <>
      {uuid && (
        <Popover>
          <PopoverTrigger>
            <div className="flex relative">
              <div
                className={`w-2xs h-70 ${noteColorClassMap[localNoteColor as keyof typeof noteColorClassMap]} shadow-sm overflow-hidden rounded-xs}`}
              >
                <div className="flex flex-col justify-between h-full p-2 text-xs">
                  <textarea
                    value={noteContent}
                    onChange={handleNoteContentChange}
                    placeholder="Type in your idea..."
                    className="resize-none p-2 w-full tracking-wide h-full bg-transparent border-none outline-none text-lg text-muted-foreground brightness-25"
                    aria-label="Note input"
                    autoFocus
                  />
                  <span className="text-muted-foreground brightness-50 mt-1 ml-1 tracking-wide text-xs self-start">
                    {author?.firstname || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent side="top" sideOffset={10}>
            <div className="bg-popover flex items-center justify-around h-fit">
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
                {fillColors.map((noteColor, i) => {
                  return (
                    <Circle
                      key={i}
                      style={{
                        fill: `var(--${noteColor})`,
                      }}
                      className={`w-4 h-4 cursor-pointer brightness- ${
                        localNoteColor === noteColor
                          ? 'ring-2 ring-primary rounded-full'
                          : ''
                      }`}
                      strokeWidth={2.5}
                      onClick={() => handleNoteColorChange(noteColor)}
                    />
                  );
                })}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex flex-col mr-1.5">
                      <Toggle
                        size="sm"
                        variant="ghost"
                        className="cursor-pointer py-2"
                        onClick={handleVote}
                      >
                        {isUserVoter ? (
                          <Star className="fill-foreground" />
                        ) : (
                          <Star strokeWidth={2.5} />
                        )}
                      </Toggle>
                      <p className="text-xs font-semibold">
                        {note.totalVotes || 0}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Vote / Unvote</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <PanelToggle noteId={uuid} />
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};
