import { StickyNote } from 'lucide-react';

interface RoomProps {
  title: string;
  updatedAt: string;
}

export const Room = ({ title, updatedAt }: RoomProps) => {
  return (
    <div className="w-full max-w-sm rounded-3xl border shadow-lg bg-card text-foreground hover:transform hover:scale-110 transition-transform duration-200">
      <div className="h-[150px] bg-gray-100 flex items-center rounded-t-3xl justify-center">
        <span className="text-card">Preview Page</span>
      </div>

      <div className="flex items-start gap-2 p-4">
        <StickyNote className="text-primary w-5 h-5 mt-1" />
        <div className="flex flex-col">
          <p className="font-bold text-xl text-foreground">{title}</p>
          <p className="text-xs align-end text-gray-400">
            Updated at:{' '}
            {new Date(updatedAt).toLocaleDateString('en-GB').slice(0, 10)}
          </p>
        </div>
      </div>
    </div>
  );
};
