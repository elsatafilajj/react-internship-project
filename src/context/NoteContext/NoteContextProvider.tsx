import { createContext, useContext, useRef, useState } from 'react';

type NoteRefs = { [noteId: string]: React.RefObject<HTMLElement> };

const NoteScrollContext = createContext<{
  registerNoteRef: (id: string, ref: React.RefObject<HTMLElement>) => void;
  scrollToNote: (id: string) => void;
  selectedNoteId: string | null;
}>({
  registerNoteRef: () => {},
  scrollToNote: () => {},
  selectedNoteId: null,
});

export const useNoteScroll = () => useContext(NoteScrollContext);

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const noteRefs = useRef<NoteRefs>({});
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const registerNoteRef = (id: string, ref: React.RefObject<HTMLElement>) => {
    noteRefs.current[id] = ref;
  };

  const scrollToNote = (id: string) => {
    const element = noteRefs.current[id]?.current;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setSelectedNoteId(id);
    }
  };

  return (
    <NoteScrollContext.Provider
      value={{ registerNoteRef, scrollToNote, selectedNoteId }}
    >
      {children}
    </NoteScrollContext.Provider>
  );
};
