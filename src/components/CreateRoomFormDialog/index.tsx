import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

import { createRoom } from '@/api/Room/room.client';
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

export const CreateRoomFormDialog = () => {
  const queryClient = useQueryClient();

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
        await createRoomMutation.mutateAsync(values);
        formikHelpers.resetForm();
      } catch {
        console.error('Room creation failed');
      }
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="justify-start">
          <Plus className="mr-2 h-4 w-4" />
          New Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Room</DialogTitle>
          <DialogDescription>
            Create your new room in one-click
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid">
              <Input
                type="text"
                name="title"
                id="title"
                placeholder="Name of your room"
                className="col-span-3"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={getFormikError(formik, 'title')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-[100px]"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
