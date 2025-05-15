import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

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
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { roomsCreatedTable } from '@/mock/roomsCreatedTable';
import { CreateRoomSchema } from '@/schemas/CreateRoomSchema';

export const CreateRoomForm = () => {
  const queryClient = useQueryClient();

  const createRoomMutation = useMutation({
    mutationFn: roomsCreatedTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
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
          <DialogTitle>Create project</DialogTitle>
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
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
