import { StickyNote } from 'lucide-react';

import { getFormattedDate } from '@/helpers/getFormattedDate';

interface RoomProps {
  title: string;
  updatedAt: string;
  onClick: () => void;
}

const backgrounds = [
  "bg-[url('@/assets/images/background-1.jpg')]",
  "bg-[url('@/assets/images/background-2.jpg')]",
  "bg-[url('@/assets/images/background-3.jpg')]",
  "bg-[url('@/assets/images/background-4.jpg')]",
  "bg-[url('@/assets/images/background-5.jpg')]",
  "bg-[url('@/assets/images/background-6.jpg')]",
  "bg-[url('@/assets/images/background-7.jpg')]",
  "bg-[url('@/assets/images/background-8.jpg')]",
  "bg-[url('@/assets/images/background-9.jpg')]",
  "bg-[url('@/assets/images/background-10.jpg')]",
];

export const RoomCard = ({ title, updatedAt, onClick }: RoomProps) => {
  const random = Math.floor(Math.random() * backgrounds.length);

  const backgroundImg = backgrounds[random];

  return (
    <div
      className="w-full max-w-sm cursor-pointer shadow-xl shadow-black/10 rounded-xl"
      onClick={onClick}
    >
      <div
        className={`h-[150px] ${backgroundImg} bg-cover bg-center bg-no-repeat flex items-center rounded-t-xl justify-center`}
      ></div>

      <div className="flex items-start gap-2 p-4 bg-card rounded-b-xl">
        <StickyNote className="text-primary w-5 h-5 mt-1" />
        <div className="text-foreground flex justify-between w-full">
          <div className="flex flex-col">
            <p className="font-semibold text-xl break-words line-clamp-1">
              {title}
            </p>
            <p className="text-xs align-end text-gray-400">
              Updated at: {getFormattedDate(new Date(updatedAt))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
