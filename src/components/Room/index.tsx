import { StickyNote } from 'lucide-react';

interface RoomProps {
  title: string;
  updatedAt: string;
}

export const Room = ({ title, updatedAt }: RoomProps) => {
  return (
    <div className="w-full max-w-sm rounded-3xl border shadow-lg bg-white">
      <div className="h-[150px] bg-gray-100 flex items-center rounded-t-3xl justify-center">
        <span className="text-gray-400">Preview Page</span>
      </div>

      <div className="flex items-start gap-2 p-4">
        <StickyNote className="text-primary w-5 h-5 mt-1" />
        <div className="text-gray-800 flex flex-col">
          <p className="font-bold text-xl">{title}</p>
          <p className="text-xs align-end text-gray-500">
            Updated at:{' '}
            {new Date(updatedAt).toLocaleDateString('en-GB').slice(0, 8)}
          </p>
        </div>
      </div>
    </div>
  );
};
