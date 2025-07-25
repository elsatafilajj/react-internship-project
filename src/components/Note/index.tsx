import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Circle, Crown, List, MessageSquare, Star, Trash2 } from 'lucide-react';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { useGetAllCommentsQuery } from '@/api/Comments/comments.queries';
import { NoteItem } from '@/api/Note/note.types';
import {
  useGetNoteByIdQuery,
  useGetNoteVotesQuery,
  useGetWinnerNotes,
} from '@/api/Note/notes.queries';
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
import { useNoteScrollContext } from '@/context/NoteScrollContext/NoteScrollContext';
import { getSocket } from '@/helpers/socket';
import { useDebounce } from '@/hooks/useDebounce';

interface NoteProps {
  setTransformDisabled: (b: boolean) => void;
  noteId: NoteItem['uuid'] | undefined;
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

export const Note = ({
  noteId,
  isReadOnly,
  setTransformDisabled,
}: NoteProps) => {
  const socket = useMemo(() => getSocket(), []);
  const { roomId } = useParams<{ roomId: string }>();
  const noteRef = useRef<HTMLDivElement | null>(null);

  const { data: singleNote } = useGetNoteByIdQuery(noteId || '');
  const noteItem = singleNote?.data;

  const [noteSize, setNoteSize] = useState({ width: 300, height: 300 });
  const [isResizing, setIsResizing] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [hasUserEdited, setHasUserEdited] = useState(false);

  const [localNoteColor, setLocalNoteColor] = useState<string>(
    noteItem?.color || 'note-background-green',
  );
  const [noteContent, setNoteContent] = useState('');
  const [editingUsers, setEditingUsers] = useState<Record<string, string>>({});

  const { user } = useAuthContext();

  const { selectedNoteId, bringToFront } = useNoteScrollContext();

  const queryClient = useQueryClient();

  const { data: comment } = useGetAllCommentsQuery(noteId || '');

  const { data: noteVotes } = useGetNoteVotesQuery(noteId || '');

  const isUserVoter = Boolean(
    noteVotes?.data?.find((voter) => voter.uuid === user?.uuid),
  );

  const [hasVoted, setHasVoted] = useState<boolean>(isUserVoter);

  const totalVotes = noteVotes?.data?.length ?? 0;

  const { data: winnerNote } = useGetWinnerNotes(roomId || '');
  const isWinner = Boolean(
    winnerNote?.data?.find((note) => note.uuid === noteId),
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const debouncedContent: string = useDebounce(noteContent, 1000);

  useEffect(() => {
    if (noteItem?.color) setLocalNoteColor(noteItem?.color);
  }, [noteItem?.color]);

  useEffect(() => {
    if (noteItem?.content != null && !hasUserEdited) {
      setNoteContent(noteItem.content);
    }
  }, [noteItem?.content]);

  const handleEnterKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart } = textarea;
    const text = noteContent;
    const lines = text.split('\n');

    let charCount = 0;
    let lineIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length + 1 > selectionStart) {
        lineIndex = i;
        break;
      }
      charCount += lines[i].length + 1;
    }

    const currentLine = lines[lineIndex];

    if (currentLine.startsWith('• ')) {
      e.preventDefault();

      const before = text.substring(0, selectionStart);
      const after = text.substring(selectionStart);

      const updated = `${before}\n• ${after}`;
      setNoteContent(updated);

      setTimeout(() => {
        const newPos = selectionStart + 3;
        textarea.setSelectionRange(newPos, newPos);
      }, 0);
    }
  };

  const toggleBulletOnCurrentLine = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart } = textarea;
    const text = noteContent;
    const lines = text.split('\n');

    let charCount = 0;
    let lineIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length + 1 > selectionStart) {
        lineIndex = i;
        break;
      }
      charCount += lines[i].length + 1;
    }

    const line = lines[lineIndex];

    if (line.startsWith('• ')) {
      lines[lineIndex] = line.replace(/^• /, '');
    } else {
      lines[lineIndex] = '• ' + line;
    }

    const updated = lines.join('\n');
    setNoteContent(updated);

    setTimeout(() => {
      const pos = selectionStart + (line.startsWith('• ') ? -2 : 2);
      textarea.setSelectionRange(pos, pos);
    }, 0);
  };

  useEffect(() => {
    if (hasUserEdited) {
      socket.emit(socketEvents.UpdateNote, {
        roomId,
        noteId: noteId,
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

  useEffect(() => {
    const handleStart = ({
      editedNoteId,
      userId,
      firstName,
    }: {
      roomId: string;
      editedNoteId: string;
      userId: string;
      firstName: string;
    }) => {
      if (editedNoteId === noteId && userId !== user?.uuid) {
        setEditingUsers((prev) => ({ ...prev, [userId]: firstName }));
      }
    };

    const handleStop = ({
      noteId,
      userId,
    }: {
      noteId: string;
      userId: string;
    }) => {
      if (noteId === noteId && userId !== user?.uuid) {
        setEditingUsers((prev) => {
          const copy = { ...prev };
          delete copy[userId];
          return copy;
        });
      }
    };

    socket.on(socketEvents.NotesEditingStarted, handleStart);
    socket.on(socketEvents.NotesEditingStoped, handleStop);

    return () => {
      socket.off(socketEvents.NotesEditingStarted, handleStart);
      socket.off(socketEvents.NotesEditingStoped, handleStop);
    };
  }, []);

  useEffect(() => {
    if (noteVotes && user?.uuid) {
      const userHasVoted = noteVotes.data?.some(
        (voter) => voter.uuid === user.uuid,
      );
      setHasVoted(userHasVoted);
    }
  }, [noteVotes, user?.uuid]);

  const handleNoteContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(event.target.value);
    setHasUserEdited(true);
    setTransformDisabled(true);
  };

  const handleNoteColorChange = (noteColor: string) => {
    setLocalNoteColor(noteColor);
    if (!noteId) return;

    socket.emit(socketEvents.UpdateNote, {
      roomId,
      noteId: noteId,
      updates: { color: noteColor },
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.getNoteIdsByRoomId(roomId || ''),
    });
  };

  const handleVote = () => {
    if (!noteId) return;

    if (hasVoted) {
      socket.emit(socketEvents.RemoveVote, {
        roomId: roomId,
        noteId: noteId,
      });
      toast.success('Vote removed!');
      setHasVoted(false);
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNoteIdsByRoomId(roomId || ''),
      });
    } else {
      socket.emit(socketEvents.AddVote, {
        roomId: roomId,
        noteId: noteId,
      });
      toast.success('Voted! 🎉');
      setHasVoted(true);
      queryClient.invalidateQueries({
        queryKey: queryKeys.getNoteIdsByRoomId(roomId || ''),
      });
    }
  };

  const handleDeleteNote = (noteId: string) => {
    socket.emit(socketEvents.DeleteNote, { roomId, noteId });
    queryClient.invalidateQueries({
      queryKey: queryKeys.getNoteIdsByRoomId(roomId || ''),
    });
    setTransformDisabled(false);
  };

  if (!noteId) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative flex flex-col items-center">
          <div
            ref={noteRef}
            onDoubleClick={(e) => {
              if (
                (e.target as HTMLElement).tagName.toLowerCase() !== 'textarea'
              ) {
                setIsOpen(true);
              }
            }}
            onClick={(e) => {
              if (
                (e.target as HTMLElement).tagName.toLowerCase() !== 'textarea'
              ) {
                bringToFront(noteId);
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
              'relative w-full p-3 text-xs cursor-move flex flex-col justify-between',
              selectedNoteId === noteId &&
                'ring-4 ring-primary/60 shadow-xl scale-[1.02] z-20 animate-pulse-slow',
              !!isWinner && 'ring-1 ring-yellow-400',
            )}
          >
            <span className="absolute flex text-black self-end italic uppercase opacity-30">
              #{noteId.slice(0, 4)}
            </span>
            <textarea
              name="content"
              onClick={() => setIsOpen(false)}
              onSelect={() => {
                setTransformDisabled(true);
                bringToFront(noteId);
              }}
              onPointerDownCapture={() => setTransformDisabled(true)}
              onFocus={() => {
                setTransformDisabled(true);

                socket.emit(socketEvents.NotesEditingStart, {
                  roomId,
                  noteId: noteId,
                  userId: user?.uuid,
                  firstName: user?.firstName,
                });
              }}
              onBlur={() => {
                setTransformDisabled(false);

                socket.emit(socketEvents.NotesEditingStop, {
                  roomId,
                  noteId: noteId,
                  userId: user?.uuid,
                });
              }}
              ref={textareaRef}
              onMouseOutCapture={() => setTransformDisabled(false)}
              readOnly={isReadOnly}
              value={noteContent}
              onChange={handleNoteContentChange}
              onKeyDown={handleEnterKey}
              placeholder="Type in your idea..."
              className="w-full resize-none h-full overflow-y-auto p-2 tracking-wide border-none outline-none text-lg text-black"
              aria-label="Note input"
            />
            {Object.values(editingUsers).length > 0 && (
              <div className="absolute top-1 right-2 text-[10px] text-gray-500 italic z-30 bg-white/70 px-1 rounded shadow-sm">
                {Object.values(editingUsers).join(', ')} is editing...
              </div>
            )}

            <div className="flex justify-between items-center w-full">
              <span className="text-black/60 text-s ml-[7px] capitalize">
                {(noteItem &&
                  noteItem.lastName &&
                  `${noteItem.firstName} ${noteItem.lastName}`) ||
                  'Unknown'}
              </span>

              <div className="flex items-center gap-1 -mr-[15px]">
                <div className="flex items-center gap-1 -mr-[15px]">
                  {comment?.data && comment?.data?.length !== 0 && (
                    <span
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 "
                      title="This note has comments"
                    >
                      <MessageSquare className="w-3 h-3 text-blue-500 fill-blue-300" />
                    </span>
                  )}

                  {noteVotes && totalVotes > 0 && (
                    <span
                      className="text-[11px] font-medium text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full flex items-center gap-1"
                      title="Total votes"
                    >
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-300" />
                      {totalVotes}
                    </span>
                  )}

                  <div
                    className="cursor-se-resize w-5 h-5 text-xs -mb-[10px] mr-1"
                    onClick={() => setIsResizing(true)}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {!!isWinner && (
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
              <TooltipTrigger asChild>
                <Trash2
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => !isReadOnly && handleDeleteNote(noteId)}
                />
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                onClick={toggleBulletOnCurrentLine}
                className="cursor-pointer"
                asChild
              >
                <List className="h-5 w-5" />
              </TooltipTrigger>
              <TooltipContent>Bulleted list</TooltipContent>
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
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center">
                  <Toggle
                    size="sm"
                    variant="ghost"
                    className="cursor-pointer py-2"
                    onClick={() => !isReadOnly && handleVote()}
                  >
                    {hasVoted ? (
                      <Star className="fill-foreground stroke-1" />
                    ) : (
                      <Star strokeWidth={2.5} />
                    )}
                  </Toggle>
                  <p className="text-xs font-semibold">
                    {(noteVotes && totalVotes) || 0}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>Vote / Unvote</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <PanelToggle noteId={noteId} />
        </div>
      </PopoverContent>
    </Popover>
  );
};
