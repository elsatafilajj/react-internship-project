import { ReactNode, useRef, useState } from 'react';

import {
  NoteScrollContext,
  NoteScrollContextType,
} from '@/context/NoteContext/NoteScrollContext';

type NoteRefs = { [noteId: string]: React.RefObject<HTMLElement> };

interface NoteScrollProviderProps {
  children: ReactNode;
}

export const NoteScrollProvider = ({ children }: NoteScrollProviderProps) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const noteRefs = useRef<NoteRefs>({});

  const registerNoteRef = (id: string, ref: React.RefObject<HTMLElement>) => {
    noteRefs.current[id] = ref;
  };

  const scrollToNote = (id: string) => {
    const element = noteRefs.current[id]?.current;
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
      setSelectedNoteId(id);
    }
  };

  const context: NoteScrollContextType = {
    registerNoteRef,
    scrollToNote,
    selectedNoteId,
  };

  return (
    <NoteScrollContext.Provider value={context}>
      {children}
    </NoteScrollContext.Provider>
  );
};
