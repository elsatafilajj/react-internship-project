import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, Share2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { getInviteCodeForRoom } from '@/api/Room/room.client';
import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
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
import { Config } from '@/constants/config';
import { queryKeys } from '@/constants/queryKeys';

export const ShareLinkAlertDialog = () => {
  const [code, setCode] = useState('');

  const queryClient = useQueryClient();
  const { roomId } = useParams<{ roomId: string }>();
  const { data } = useGetRoomByIdQuery(roomId || '');

  const shareLinkMutation = useMutation({
    mutationFn: (roomId: string) => getInviteCodeForRoom(roomId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleRoom(roomId || ''),
      });
      setCode(data?.data?.inviteCode);
    },
  });

  const handleShareLinkClick = () => {
    shareLinkMutation.mutateAsync(roomId || '');
  };
  const handleCopyLink = () => {
    if (!code) return;
    const link = `${Config.joinRoomUrl}/${code}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div id="share">
          {data?.data?.isActive && (
            <Button
              className="bg-primary text-black px-3 sm:px-4 -gap-1 hover:opacity-90  hover:text-foreground w-fit sm:w-[75px]"
              onClick={handleShareLinkClick}
              size="sm"
            >
              <Share2 className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden md:block">Share</span>
            </Button>
          )}
        </div>
      </DialogTrigger>

      {shareLinkMutation.isPending ? (
        'loading'
      ) : (
        <DialogContent className="sm:max-w-md space-y-2">
          <DialogHeader>
            <DialogTitle className="text-base">Share link</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 sm:space-x-0">
            <div className="grid flex-1 gap-2 text-white">
              <Input
                name="link"
                id="link"
                defaultValue={`${Config.joinRoomUrl}/${code}`}
                readOnly
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="px-3 bg-card border hover:bg-card transform hover:scale-110 transition-transform duration-200"
              onClick={handleCopyLink}
            >
              <span className="sr-only">Copy</span>
              <Copy className="text-card-revert" />
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" className="w-[100px]">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
