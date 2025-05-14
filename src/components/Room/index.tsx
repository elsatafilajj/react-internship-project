import { StickyNote } from 'lucide-react';

interface RoomProps {
  title: string;
  createdAt: string;
}

export const Room = ({ title, createdAt }: RoomProps) => {
  return (
    <div className="w-full max-w-sm rounded-3xl border shadow-lg bg-white">
      <div className="h-[150px] bg-gray-100 flex items-center rounded-t-3xl justify-center">
        <span className="text-gray-400">Preview Page</span>
      </div>

      <div className="flex items-start gap-2 p-4">
        <StickyNote className="text-primary w-6 h-6 mt-1" />
        <div className="text-gray-800">
          <p className="font-semibold text-lg">{title}</p>
          <p className="text-sm text-gray-500">
            Created at:{' '}
            {new Date(createdAt).toLocaleDateString('en-GB').slice(0, 8)}
          </p>
        </div>
      </div>
    </div>
  );
};
