import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { NoteItem } from '@/api/Note/note.types';
import { PanelToggle } from '@/components/CommentsPanel/PanelToggle';
import { socketEvents } from '@/constants/socketEvents';
import { getSocket } from '@/helpers/socket';
import { useDebounce } from '@/hooks/useDebounce';

interface NoteProps {
  note: Partial<NoteItem>;
}

export const Note = ({ note }: NoteProps) => {
  const socket = getSocket();
  const { roomId } = useParams<{ roomId: string }>();
  const [noteContent, setNoteContent] = useState('');
  const { uuid, content, author } = note;
  const hasUserInteracted = useRef(false);

  const debouncedContent: string = useDebounce(noteContent, 1000);

  useEffect(() => {
    if (content) {
      setNoteContent(content);
    }
  }, [content]);

  useEffect(() => {
    if (hasUserInteracted.current && debouncedContent !== content) {
      socket.emit(socketEvents.UpdateNote, {
        roomId,
        noteId: uuid,
        updates: { content: debouncedContent },
      });
    }
  }, [debouncedContent, content, roomId, uuid]);

  const handleNoteContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    hasUserInteracted.current = true;
    setNoteContent(event.target.value);
  };

  return (
    <div className="flex">
      <div className=" w-2xs h-70 bg-note-background-pink shadow-sm overflow-hidden">
        <div className="flex flex-col justify-between h-full p-2 text-xs">
          <textarea
            value={noteContent}
            onChange={handleNoteContentChange}
            placeholder="Type in your idea..."
            className="resize-none p-2 w-full tracking-wide h-full bg-transparent border-none outline-none text-sm text-muted-foreground brightness-25"
            aria-label="Note input"
            autoFocus
          />
          <span className="text-gray-700 mt-1 ml-1 tracking-wide  text-xs">
            {author?.firstName}
          </span>
        </div>
      </div>

      <PanelToggle noteId={uuid || ''} />
    </div>
  );
};
