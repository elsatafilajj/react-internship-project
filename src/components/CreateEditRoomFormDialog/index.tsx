import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { createRoom, updateRoom } from '@/api/Room/room.client';
import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { UpdateRoomInput } from '@/api/Room/room.types';
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
      queryClient.invalidateQueries({ queryKey: queryKeys.getRooms() });
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
      title: '',
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        if (roomId) {
          await editMutation.mutateAsync({
            roomId,
            data: { title: room?.data.title },
          });
        } else {
          await createRoomMutation.mutateAsync(values);
        }

        formikHelpers.resetForm();
      } catch (error) {
        console.error('Submit failed:', error);
        toast.error('Something went wrong!');
      }
    },
  });

  return (
    <Dialog>
      <DialogTrigger className="text-sm ml-2" asChild>
        {isEditMode ? (
          <Button
            variant="ghost"
            size="sm"
            className="pl-0 text-sm text-left ml-0 w-[60px] "
          >
            Edit
          </Button>
        ) : (
          <Button className="justify-start w-[150px]">
            <Plus className="mr-2 h-4 w-4" />
            New Room
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Room' : 'Create Room'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Make changes to your room here. Click save when you're done"
              : 'Create your new room in one-click'}
          </DialogDescription>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder={isEditMode ? room?.data.title : 'Enter room name'}
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
