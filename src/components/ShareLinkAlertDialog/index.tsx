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

export const ShareLinkAlertDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary text-black px-3 sm:px-4 hover:opacity-90 w-fit sm:w-[100px]">
          <Share2 className="mr-0 sm:mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md space-y-2">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
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
            className="px-3 bg-white border hover:bg-gray-100"
          >
            <span className="sr-only">Copy</span>
            <Copy className="text-black" />
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
