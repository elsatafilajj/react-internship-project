import clsx from 'clsx';
import { Circle, Star, X } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { NoteItem } from '@/api/Note/note.types';
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
  const [isOpen, setIsOpen] = useState(false);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [localNoteColor, setLocalNoteColor] = useState<string>(
    note.color || 'note-background-green',
  );
  const { roomId } = useParams<{ roomId: string }>();
  const [noteContent, setNoteContent] = useState('');
  const { uuid, content, author } = note;
  const { selectedNoteId } = useNoteScrollContext();

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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          onClick={(e) => {
            const tag = (e.target as HTMLElement).tagName.toLowerCase();
            if (tag !== 'textarea') {
              setIsOpen(true);
            }
          }}
          className={clsx(
            'w-2xs h-70 shadow-sm overflow-hidden scroll-mt-24 transition-all duration-300 rounded-xs',
            noteColorClassMap[localNoteColor as keyof typeof noteColorClassMap],
            selectedNoteId === uuid &&
              'ring-4 ring-primary/60 shadow-xl scale-[1.02] z-20 animate-pulse-slow',
          )}
        >
          <div className="flex flex-col justify-between h-full p-2 text-xs">
            <textarea
              value={noteContent}
              onChange={handleNoteContentChange}
              placeholder="Type in your idea..."
              className="resize-none p-2 w-full tracking-wide h-full bg-transparent border-none outline-none text-sm text-muted-foreground brightness-25"
              aria-label="Note input"
            />
            <span className="text-muted-foreground brightness-50 mt-1 ml-1 tracking-wide text-xs self-start">
              {author?.firstName || 'Unknown'}
            </span>
          </div>
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
                  onClick={() => handleDeleteNote(note.uuid || '')}
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
                onClick={() => handleNoteColorChange(noteColor)}
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
  );
};
