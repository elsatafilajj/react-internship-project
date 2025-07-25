import { useContext, createContext } from 'react';

import { emptyFunction } from '@/helpers/emptyFunction';

export interface NoteScrollContextType {
  registerNoteRef: (id: string, ref: React.RefObject<HTMLElement>) => void;
  bringToFront: (id: string) => void;
  scrollToNote: (id: string) => void;
  selectedNoteId: string | null;
}

const NoteScrollContextValues: NoteScrollContextType = {
  registerNoteRef: emptyFunction,
  bringToFront: emptyFunction,
  scrollToNote: emptyFunction,
  selectedNoteId: null,
};

export const NoteScrollContext = createContext(NoteScrollContextValues);

export const useNoteScrollContext = () => useContext(NoteScrollContext);
