import clsx from 'clsx';
import { Circle, Crown, MessageSquare, Star, X } from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
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
  setTransformDisabled: (b: boolean) => void;
  note: Partial<NoteItem>;
  isReadOnly: boolean;
}

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

export const Note = ({ note, isReadOnly, setTransformDisabled }: NoteProps) => {
  const [noteSize, setNoteSize] = useState({ width: 300, height: 300 });
  const [isResizing, setIsResizing] = useState(false);

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
  const noteRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuthContext();

  const isUserVoter = note.noteVotes?.find(
    (item) => item.user.uuid === user?.uuid,
  );
  const [hasVoted, setHasVoted] = useState<boolean>(!!isUserVoter);

  const debouncedContent: string = useDebounce(noteContent, 1000);

  useEffect(() => {
    if (note.color) setLocalNoteColor(note.color);
  }, [note.color]);

  useEffect(() => {
    if (content) setNoteContent(content);
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !noteRef.current) return;
      const rect = noteRef.current.getBoundingClientRect();
      setNoteSize({
        width: Math.max(300, e.clientX - rect.left),
        height: Math.max(300, e.clientY - rect.top),
      });
    };

    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

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

  const handleVote = () => {
    if (!uuid) return;

    if (hasVoted) {
      socket.emit(socketEvents.RemoveVote, {
        roomId,
        noteId: uuid,
      });
      toast.success('Vote removed!');
      setHasVoted(false);
    } else {
      socket.emit(socketEvents.AddVote, {
        roomId,
        noteId: uuid,
      });
      toast.success('Voted! 🎉');
      setHasVoted(true);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    socket.emit(socketEvents.DeleteNote, { roomId, noteId });
  };

  if (!uuid) return null;

  const notes = data?.data ?? [];
  const maxVotes = Math.max(...notes.map((n) => n.totalVotes ?? 0));
  const isWinner = (note.totalVotes ?? 0) === maxVotes && maxVotes > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative flex flex-col items-center">
          <div
            ref={noteRef}
            onClick={(e) => {
              if (
                (e.target as HTMLElement).tagName.toLowerCase() !== 'textarea'
              ) {
                setIsOpen(true);
              }
            }}
            style={{
              width: `${noteSize.width}px`,
              height: `${noteSize.height}px`,
            }}
            className={clsx(
              noteColorClassMap[
                localNoteColor as keyof typeof noteColorClassMap
              ],
              'relative w-full border p-3 text-xs cursor-move flex flex-col justify-between',
              selectedNoteId === uuid &&
                'ring-4 ring-primary/60 shadow-xl scale-[1.02] z-20 animate-pulse-slow',
              isWinner && 'ring-1 ring-yellow-400',
            )}
          >
            <textarea
              onClick={() => setTransformDisabled(false)}
              onFocus={() => setTransformDisabled(true)}
              onMouseOutCapture={() => setTransformDisabled(false)}
              readOnly={isReadOnly}
              value={noteContent}
              onChange={handleNoteContentChange}
              placeholder="Type in your idea..."
              className="w-full resize-none h-full max-h-[250px] overflow-y-auto p-2 tracking-wide  border-none outline-none text-sm text-black"
              aria-label="Note input"
            />

            <div className="flex justify-between items-center w-full">
              <span className="text-gray-700 text-xs ml-[7px]">
                {author?.firstName || 'Unknown'}
              </span>

              <div className="flex items-center gap-1 -mr-[15px]">
                <span
                  className="text-[11px] font-medium text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1"
                  title="Total comments"
                >
                  <MessageSquare className="w-3 h-3 text-blue-500 fill-blue-300" />
                  3
                </span>

                {(note.totalVotes ?? 0) > 0 && (
                  <span
                    className="text-[11px] font-medium text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full flex items-center gap-1"
                    title="Total votes"
                  >
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-300" />
                    {note.totalVotes}
                  </span>
                )}

                <div
                  className="cursor-se-resize w-5 h-5 text-xs -mb-[12px]"
                  onClick={() => setIsResizing(true)}
                ></div>
              </div>
            </div>
          </div>

          {isWinner && (
            <div className="absolute -top-[19px] -left-[16px] z-50">
              <Crown className="w-8 h-8 text-amber-300 fill-amber-200 drop-shadow-lg -rotate-37" />
            </div>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent side="top" align="center" sideOffset={10}>
        <div className="flex items-center justify-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <X
                  className="cursor-pointer"
                  size={20}
                  strokeWidth={2.5}
                  onClick={() => !isReadOnly && handleDeleteNote(uuid)}
                />
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {fillColors.map((color) => (
            <Circle
              key={color}
              className={clsx(
                'w-4 h-4 cursor-pointer',
                localNoteColor === color && 'ring-2 ring-primary rounded-full',
              )}
              strokeWidth={2.5}
              style={{ fill: `var(--${color})` }}
              onClick={() => !isReadOnly && handleNoteColorChange(color)}
            />
          ))}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex flex-col items-center">
                  <Toggle
                    size="sm"
                    variant="ghost"
                    className="cursor-pointer py-2"
                    onClick={() => !isReadOnly && handleVote()}
                  >
                    {hasVoted ? (
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
