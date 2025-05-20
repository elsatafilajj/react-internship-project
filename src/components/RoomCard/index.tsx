import { StickyNote } from 'lucide-react';

import { getFormattedDate } from '@/helpers/getFormattedDate';

interface RoomProps {
  title: string;
  updatedAt: string;
  onClick: () => void;
}

export const RoomCard = ({ title, updatedAt, onClick }: RoomProps) => {
  return (
    <div className="w-full max-w-sm border shadow-lg rounded-md bg-white">
      <div
        className="h-[150px] bg-gray-100 flex items-center rounded-md justify-center"
        onClick={onClick}
      >
        <span className="text-gray-400">Preview Page</span>
      </div>

      <div className="flex items-start gap-2 p-4">
        <StickyNote className="text-primary w-5 h-5 mt-1" />
        <div className="text-gray-800 flex justify-between w-full">
          <div className="flex flex-col">
            <p className="font-bold text-xl">{title}</p>
            <p className="text-xs align-end text-gray-500">
              Updated at: {getFormattedDate(new Date(updatedAt))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
