import { ReactNode, useRef, useState } from 'react';

import {
  NoteScrollContext,
  NoteScrollContextType,
} from '@/context/NoteScrollContext/NoteScrollContext';

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

  const bringToFront = (id: string) => {
    const currentElement = noteRefs.current[id]?.current;

    Object.values(noteRefs.current).forEach((element) => {
      if (element.current) {
        element.current.style.zIndex = '0';
      }
    });

    if (currentElement) {
      currentElement.style.zIndex = '1';
    }
  };

  const scrollToNote = (id: string) => {
    const element = noteRefs.current[id]?.current;
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      setSelectedNoteId(id);
    }
  };

  const context: NoteScrollContextType = {
    registerNoteRef,
    scrollToNote,
    selectedNoteId,
    bringToFront,
  };

  return (
    <NoteScrollContext.Provider value={context}>
      {children}
    </NoteScrollContext.Provider>
  );
};
