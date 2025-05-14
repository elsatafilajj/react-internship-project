import { StickyNote } from 'lucide-react';

interface RoomProps {
  title: string;
  createdAt: string;
}

export const Room = ({ title, createdAt }: RoomProps) => {
  return (
    <div className="w-[350px] rounded-3xl justify-center border shadow-lg  overflow-hidden bg-white">
      <div className="h-[150px] bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400">Preview Page</span>
      </div>

      <div className="flex items-start gap-2 p-4">
        <StickyNote className="text-primary w-6 h-6 mt-1 items-center" />
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
