import { useQueryClient } from '@tanstack/react-query';
import { SendHorizontal } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { queryKeys } from '@/constants/queryKeys';
import { getFormikError } from '@/helpers/getFormikError';
import { getSocket } from '@/helpers/socket';
import { useForm } from '@/hooks/useForm';
import { CommentSchema } from '@/schemas/CommentSchema';

interface ReplyCommentFormProps {
  parentId: string;
  noteId: string;
}

export const ReplyCommentForm = ({
  parentId,
  noteId,
}: ReplyCommentFormProps) => {
  const queryClient = useQueryClient();
  const socket = getSocket();
  const params = useParams<{ roomId: string }>();

  const formikReply = useForm({
    schema: CommentSchema,
    initialValues: {
      noteId,
      content: '',
      parentId: parentId,
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        socket.emit('addComment', { roomId: params.roomId, payload: values });
        queryClient.invalidateQueries({
          queryKey: queryKeys.getCommentsByNoteId(noteId),
        });
        formikHelpers.resetForm();
      } catch {
        console.error('comment creation failed');
      }
    },
  });

  return (
    <form onSubmit={formikReply.handleSubmit} className="flex space-y-2">
      <Input
        id="content"
        name="content"
        type="text"
        placeholder="Reply..."
        value={formikReply.values.content}
        onChange={formikReply.handleChange}
        error={getFormikError(formikReply, 'content')}
        className="relative w-[230px] tracking-wide"
      />

      <Button size="sm" type="submit" className="bg-card text-foreground m-0">
        <SendHorizontal type="submit" />
      </Button>
    </form>
  );
};
