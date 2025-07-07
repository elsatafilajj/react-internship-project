import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PackagePlus, PenLineIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { createRoom } from '@/api/Room/room.client';
import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { Room } from '@/api/Room/room.types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { queryKeys } from '@/constants/queryKeys';
import { socketEvents } from '@/constants/socketEvents';
import { getFormikError } from '@/helpers/getFormikError';
import { getSocket } from '@/helpers/socket';
import { useForm } from '@/hooks/useForm';
import { CreateRoomSchema } from '@/schemas/CreateRoomSchema';

export const CreateEditRoomFormDialog = () => {
  const [open, setOpen] = useState(false);
  const { roomId } = useParams<{ roomId: string }>();
  const queryClient = useQueryClient();
  const { data: room } = useGetRoomByIdQuery(roomId || '');

  const socket = useMemo(() => getSocket(), []);

  const isEditMode = Boolean(roomId);

  const hadleEditRoom = (values: Pick<Room, 'title'>) => {
    socket.emit(socketEvents.UpdateRoom, {
      roomId,
      payload: { title: values.title },
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.getSingleRoom(roomId || ''),
    });
    toast.success('Room edited successfully.');
  };

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.getRooms() });
      toast.success('Your room has been created!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formik = useForm({
    schema: CreateRoomSchema,
    initialValues: {
      title: isEditMode ? room?.data?.title || '' : '',
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        if (roomId) {
          hadleEditRoom(values);
          formik.resetForm();
          setOpen(false);
        } else {
          await createRoomMutation.mutateAsync(values);
          setOpen(false);
        }

        formikHelpers.resetForm();
      } catch (error) {
        console.error('Submit failed:', error);
        toast.error('Something went wrong!');
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full" asChild>
        {isEditMode ? (
          <div id="create-edit-room">
            <Button size="sm" className="justify-center w-full gap-3 flex">
              <PenLineIcon className="h-4 w-4" />
              Edit
            </Button>
          </div>
        ) : (
          <div id="create-edit-room">
            <Button
              className="justify-center w-full"
              onClick={() => setOpen(true)}
            >
              <PackagePlus className="h-4 w-4" />
              New Room
            </Button>
          </div>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Room' : 'Create Room'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Make changes to your room here. Click save when you're done"
              : 'Enter new name for your room'}
          </DialogDescription>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <Input
              id="title"
              name="title"
              type="text"
              defaultValue={formik.values.title}
              onChange={formik.handleChange}
              error={getFormikError(formik, 'title')}
            />

            <DialogFooter>
              <Button
                type="submit"
                className="w-[150px]"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting
                  ? isEditMode
                    ? 'Saving...'
                    : 'Creating...'
                  : isEditMode
                    ? 'Save changes'
                    : 'Create room'}
              </Button>
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
