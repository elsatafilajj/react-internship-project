import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { NoteItem } from '@/api/Note/note.types';
import { DragNoteTypes } from '@/constants/dragNoteTypes';
import { useDebounce } from '@/hooks/useDebounce';
import { useNoteDrag } from '@/hooks/useNoteDrag';
import { getSocket } from '@/lib/socket';

interface NoteProps extends Partial<NoteItem> {
  setTransformDisabled: (b: boolean) => void;
  transformRef: React.RefObject<ReactZoomPanPinchRef>;
}

export const DraggableNote = ({
  uuid,
  xAxis,
  yAxis,
  content,
  author,
  setTransformDisabled,
  transformRef,
}: NoteProps) => {
  const noteRef = useRef<HTMLDivElement | null>(null);
  const [localContent, setLocalContent] = useState('');
  const socket = getSocket();
  const { roomId } = useParams<{ roomId: string }>();

  const debouncedContent: string = useDebounce(localContent, 1000);

  useEffect(() => {
    if (content) {
      setLocalContent(content);
    }
  }, [content]);

  useEffect(() => {
    socket.emit('updateNote', {
      roomId,
      noteId: uuid,
      updates: { content: debouncedContent },
    });
  }, [debouncedContent]);

  const handleNoteContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(event.target.value);
  };

  const [{ isDragging }, drag] = useNoteDrag({
    uuid,
    type: DragNoteTypes.Note,
    noteRef,
    transformRef,
    xAxis,
    yAxis,
  });

  drag(noteRef);

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
      <div className="flex">
        <div className=" w-2xs h-70 bg-note-background-pink shadow-sm overflow-hidden">
          <div className="flex flex-col justify-between h-full p-2 text-xs">
            <textarea
              value={localContent}
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
      </div>
    </div>
  );
};
