import { Dot, StickyNote } from 'lucide-react';

import { getFormattedDate } from '@/helpers/getFormattedDate';

interface RoomProps {
  title: string;
  updatedAt: string;
  onClick: () => void;
  isHost: string;
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

export const RoomCard = ({ title, updatedAt, onClick, isHost }: RoomProps) => {
  const random = Math.floor(Math.random() * backgrounds.length);

  const backgroundImg = backgrounds[random];

  return (
    <div
      className="w-full  cursor-pointer shadow-xl shadow-black/10 rounded-xl"
      onClick={onClick}
    >
      <div
        className={`h-[150px] ${backgroundImg} bg-cover bg-center bg-no-repeat flex items-center rounded-t-xl justify-center`}
      ></div>

      <div className="flex items-start gap-2 p-4 bg-card rounded-b-xl">
        <StickyNote className="text-primary w-5 h-5 mt-1 shrink-0" />
        <div className="flex flex-col grow overflow-hidden">
          <p className="font-semibold text-foreground text-xl tracking-wide truncate w-full">
            {title}
          </p>
          <div className="flex">
            <p className="text-xs flex items-center text-gray-400">
              Updated at: {getFormattedDate(new Date(updatedAt))}
            </p>
            <div className="text-xs text-gray-400 italic">
              {isHost === 'participant' ? (
                <p className="flex items-center">
                  {' '}
                  <Dot className="w-4 h-4" />
                  Owned by others
                </p>
              ) : (
                <p className="flex items-center">
                  <Dot className="w-4 h-4" />
                  Owned by you
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
