export const Note = () => {
  return (
    <div className="flex">
      <div className="m-4 w-50 h-50 bg-note-background-pink shadow-sm overflow-hidden">
        <div className="flex flex-col justify-between h-full p-2 text-xs">
          <textarea
            placeholder="Type anything..."
            className="resize-none p-2 w-full tracking-wide h-full bg-transparent border-none outline-none text-sm text-gray-700"
            aria-label="Note input"
            autoFocus
          />
          <span className="text-gray-700 mt-1 ml-1 tracking-wide  text-xs">
            elsa
          </span>
        </div>
      </div>
    </div>
  );
};
