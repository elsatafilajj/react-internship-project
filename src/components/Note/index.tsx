import clsx from 'clsx';
import { Circle, Crown, Star, X } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { NoteItem } from '@/api/Note/note.types';
import { useGetAllNotesFromRoomQuery } from '@/api/Note/notes.queries';
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
import { socketEvents } from '@/constants/socketEvents';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { useNoteScrollContext } from '@/context/NoteScrollContext/NoteScrollContext';
import { getSocket } from '@/helpers/socket';
import { useDebounce } from '@/hooks/useDebounce';

interface NoteProps {
  note: Partial<NoteItem>;
  isReadOnly: boolean;
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

export const Note = ({ note, isReadOnly }: NoteProps) => {
  const socket = getSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [localNoteColor, setLocalNoteColor] = useState<string>(
    note.color || 'note-background-green',
  );
  const { roomId } = useParams<{ roomId: string }>();
  const [noteContent, setNoteContent] = useState('');
  const { uuid, content, author } = note;
  const { selectedNoteId } = useNoteScrollContext();
  const { data } = useGetAllNotesFromRoomQuery(roomId || '');

  const { user } = useAuthContext();
  const isUserVoter = note.noteVotes?.find(
    (item) => item.user.uuid === user?.uuid,
  );
  const [hasVoted, setHasVoted] = useState<boolean | null>(
    !!isUserVoter || null,
  );
  const debouncedContent: string = useDebounce(noteContent, 1000);

  useEffect(() => {
    if (note.color) {
      setLocalNoteColor(note.color);
    }
  }, [note.color]);

  useEffect(() => {
    if (content) {
      setNoteContent(content);
    }
  }, [content]);

  useEffect(() => {
    if (hasUserEdited) {
      socket.emit(socketEvents.UpdateNote, {
        roomId,
        noteId: uuid,
        updates: { content: debouncedContent },
      });
    }
  }, [debouncedContent]);

  const handleNoteContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(event.target.value);
    setHasUserEdited(true);
  };

  const handleNoteColorChange = (noteColor: string) => {
    setLocalNoteColor(noteColor);
    if (!uuid) return;

    socket.emit(socketEvents.UpdateNote, {
      roomId,
      noteId: uuid,
      updates: { color: noteColor },
    });
  };

  const handleVote = async () => {
    if (!uuid) return;
    if (hasVoted && !!isUserVoter) {
      socket.emit(socketEvents.RemoveVote, {
        roomId,
        noteId: note.uuid,
      });
      toast.success('You removed the vote! 🎉');
    } else if (uuid) {
      socket.emit(socketEvents.AddVote, {
        roomId,
        noteId: note.uuid,
      });
      setHasVoted(true);
      toast.success('You voted! 🎉');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    socket.emit(socketEvents.DeleteNote, { roomId, noteId });
  };

  if (!uuid) return null;

  const notes = data?.data ?? [];

  const maxVotes = Math.max(...notes.map((note) => note.totalVotes ?? 0));

  const isWinner = (note.totalVotes ?? 0) === maxVotes && maxVotes > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="flex flex-col items-center">
          <div
            onClick={(e) => {
              const tag = (e.target as HTMLElement).tagName.toLowerCase();
              if (tag !== 'textarea') {
                setIsOpen(true);
              }
            }}
            className={clsx(
              'w-2xs h-70 relative shadow-sm overflow-hidden scroll-mt-24 transition-all duration-300 rounded-xs',
              noteColorClassMap[
                localNoteColor as keyof typeof noteColorClassMap
              ],
              selectedNoteId === uuid &&
                'ring-4 ring-primary/60 shadow-xl scale-[1.02] z-20 animate-pulse-slow',
              isWinner && 'ring-1 ring-yellow-400',
            )}
          >
            <div className="flex flex-col justify-between relative h-full p-2 text-xs">
              <textarea
                readOnly={isReadOnly}
                value={noteContent}
                onChange={(e) => {
                  if (isReadOnly) return;
                  handleNoteContentChange(e);
                }}
                placeholder="Type in your idea..."
                className="resize-none p-2 w-full tracking-wide h-full max-h-[220px] overflow-auto bg-transparent border-none outline-none text-sm text-muted-foreground brightness-25"
                aria-label="Note input"
              />
              <div className="flex justify-between items-center px-1 mt-1">
                <span className="text-muted-foreground brightness-50 tracking-wide text-xs">
                  {author?.firstName || 'Unknown'}
                </span>

                {(note.totalVotes ?? 0) > 0 && (
                  <span
                    className="text-[11px] font-medium text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1"
                    title="Total votes"
                  >
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-300" />
                    {note.totalVotes}
                  </span>
                )}
              </div>
            </div>
          </div>

          {isWinner && (
            <div className="absolute top-2 right-1 rotate-[50deg] scale-110 pointer-events-none">
              <div className="text-3xl select-none">
                <Crown className="rotate-[-20deg] w-6 h-6 text-yellow-100 drop-shadow-[0_0_8px_rgba(255,215,0,0.6)] pointer-events-none select-none" />
              </div>
            </div>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent side="top" align="end" sideOffset={10}>
        <div className="bg-popover flex items-center justify-around h-fit">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <X
                  strokeWidth={2.5}
                  size={20}
                  className="cursor-pointer"
                  onClick={() => {
                    if (isReadOnly) return;
                    handleDeleteNote(note.uuid || '');
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex gap-3 p-3">
            {fillColors.map((noteColor, i) => (
              <Circle
                key={i}
                style={{ fill: `var(--${noteColor})` }}
                className={`w-4 h-4 cursor-pointer ${
                  localNoteColor === noteColor
                    ? 'ring-2 ring-primary rounded-full'
                    : ''
                }`}
                strokeWidth={2.5}
                onClick={() => {
                  if (isReadOnly) return;
                  handleNoteColorChange(noteColor);
                }}
              />
            ))}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex flex-col mr-1.5">
                  <Toggle
                    size="sm"
                    variant="ghost"
                    className="cursor-pointer py-2"
                    onClick={() => {
                      if (isReadOnly) return;
                      handleVote();
                    }}
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
  );
};
