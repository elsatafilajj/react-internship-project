import { Square, Pencil, Type, Hand } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const tools = [
  {
    icon: Square,
    label: 'Sticky',
  },
  {
    icon: Pencil,
    label: 'Draw',
  },
  {
    icon: Type,
    label: 'Text',
  },
  {
    icon: Hand,
    label: 'Move',
  },
];

export const ToolPalette = () => {
  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white border border-gray-200 rounded-xl shadow-md px-6 py-3 flex items-center gap-6">
        {tools.map((tool, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <button className="flex flex-col items-center justify-center  hover:text-[#009966] transition">
                <tool.icon className="h-5 w-5 mb-1" />
                <span className="text-[10px] font-medium text-black/70">
                  {tool.label}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent>{tool.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
