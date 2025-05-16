import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { updateRoom } from '@/api/Room/room.client';
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
import { EditRoomSchema } from '@/schemas/EditRoomSchema';

export const EditRoomFormDialog = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const queryClient = useQueryClient();
  const { data: room } = useGetRoomByIdQuery(roomId || '');

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

  const formik = useForm({
    schema: EditRoomSchema,
    initialValues: {
      title: room?.data.title,
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        editMutation.mutateAsync({
          roomId: roomId || '',
          data: { title: values.title },
        });

        formikHelpers.resetForm();
      } catch {
        console.error('Edit failed');
      }
    },
  });

  return (
    <Dialog>
      <DialogTrigger className="text-sm ml-2">Edit</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
          <DialogDescription>
            Make changes to your room here. Click save when you're done.
          </DialogDescription>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Change room name"
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
                {formik.isSubmitting ? 'Saving...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
