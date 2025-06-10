import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PackagePlus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { createRoom, updateRoom } from '@/api/Room/room.client';
import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { UpdateRoomInput } from '@/api/Room/room.types';
import { TourRefs } from '@/components/TourSteps/TourSteps';
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
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { CreateRoomSchema } from '@/schemas/CreateRoomSchema';

export const CreateEditRoomFormDialog = () => {
  const [open, setOpen] = useState(false);
  const { roomId } = useParams<{ roomId: string }>();
  const queryClient = useQueryClient();
  const { data: room } = useGetRoomByIdQuery(roomId || '');

  const isEditMode = Boolean(roomId);

  const editMutation = useMutation({
    mutationFn: ({ roomId, data }: { roomId: string; data: UpdateRoomInput }) =>
      updateRoom(roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleRoom(roomId || ''),
      });
      toast.success('Room edited successfully.');
    },
  });

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.getRooms() });
      toast.success('Your room is created!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formik = useForm({
    schema: CreateRoomSchema,
    initialValues: {
      title: isEditMode ? room?.data.title || '' : '',
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        if (roomId) {
          await editMutation.mutateAsync({
            roomId,
            data: { title: values.title },
          });
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
      <div ref={TourRefs.createEditRoomRef}>
        <DialogTrigger className="w-full" asChild>
          {isEditMode ? (
            <Button
              variant="ghost"
              size="sm"
              className="focus:bg-accent focus:text-accent-foreground relative flex justify-start items-center gap-2 rounded-sm px-2 py-1.5 tracking-wide"
            >
              Edit
            </Button>
          ) : (
            <Button
              className="justify-center w-full"
              onClick={() => setOpen(true)}
            >
              <PackagePlus className="h-4 w-4" />
              New Room
            </Button>
          )}
        </DialogTrigger>
      </div>

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
              value={formik.values.title}
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
