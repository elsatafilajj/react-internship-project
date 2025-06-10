import { Copy, Share2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTourRefsContext } from '@/context/TourRefsContext/TourRefsContext';

export const ShareLinkAlertDialog = () => {
  const { shareLinkRef } = useTourRefsContext();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div ref={shareLinkRef}>
          <Button className="bg-primary text-black px-3 sm:px-4 hover:opacity-90  hover:text-foreground w-fit sm:w-[100px]">
            <Share2 className="mr-0 sm:mr-2 h-4 w-4" />
            <span className="hidden md:block">Share</span>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md space-y-2">
        <DialogHeader>
          <DialogTitle className="text-base">Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 sm:space-x-0">
          <div className="grid flex-1 gap-2">
            <Input
              name="link"
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3 bg-card-revert border hover:bg-foreground transform hover:scale-110 transition-transform duration-200"
          >
            <span className="sr-only">Copy</span>
            <Copy className="text-card" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start ">
          <DialogClose asChild>
            <Button type="button" className="w-[100px]">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
