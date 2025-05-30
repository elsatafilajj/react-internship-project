import { useQueryClient } from '@tanstack/react-query';
import { SendHorizontal, CornerDownLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useGetAllCommentsQuery } from '@/api/Comments/comments.queries';
import { NoteCommentResponse } from '@/api/Comments/comments.types';
import { CommentsActionsDropDown } from '@/components/CommentsActionDropDown';
import { ReplyCommentForm } from '@/components/ReplyCommentForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { queryKeys } from '@/constants/queryKeys';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { getFormattedDate } from '@/helpers/getFormattedDate';
import { getFormikError } from '@/helpers/getFormikError';
import { getSocket } from '@/helpers/socket';
import { useForm } from '@/hooks/useForm';
import { CommentSchema } from '@/schemas/CommentSchema';

interface CommentsPanelProps {
  noteId: string;
}

export const CommentsPanel = ({ noteId }: CommentsPanelProps) => {
  const [comments, setComments] = useState<NoteCommentResponse[]>([]);
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const [replyComment, setReplyComment] = useState<string | null>(null);
  const socket = getSocket();
  const roomId = useParams<{ roomId: string }>();
  const { data, isFetched } = useGetAllCommentsQuery(noteId);

  const formik = useForm({
    schema: CommentSchema,
    initialValues: {
      noteId: noteId,
      content: '',
      parent: null,
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        socket.emit('addComment', {
          roomId: roomId.roomId,
          payload: values,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.getCommentsByNoteId(noteId),
        });
        formikHelpers.resetForm();
      } catch {
        console.error('comment creation failed');
      }
    },
  });

  useEffect(() => {
    if (isFetched && data) {
      setComments(data.data);
    }
  }, [data, isFetched]);

  useEffect(() => {
    socket.on('newComment', (newComment) => {
      console.log('Received new comment:', newComment);
      if (noteId === newComment.note.uuid) {
        setComments((prev) => [...(prev || []), newComment]);
      }
    });

    return () => {
      socket.off('newComment');
    };
  }, []);

  return (
    <aside className="bg-card text-card-revert pt-5 flex flex-col h-full max-h-[90vh] rounded-md overflow-hidden shadow-md border">
      <ScrollArea className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="border rounded-md p-3 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <div className="rounded-full bg-primary w-7 h-7 text-center text-black p-1">
                {user?.firstName[0].toUpperCase()}
              </div>
              {user?.firstName} {user?.lastName}
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="flex items-center gap-2 justify-between"
            >
              <Input
                id="content"
                name="content"
                type="text"
                placeholder="Write a comment..."
                value={formik.values.content}
                onChange={formik.handleChange}
                error={getFormikError(formik, 'content')}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={formik.isSubmitting}
                size="sm"
                className="bg-primary text-black"
              >
                <SendHorizontal />
              </Button>
            </form>
          </div>

          {comments
            .filter((comment) => !comment.parent)
            .map((comment) => (
              <div
                key={comment.uuid}
                className="border rounded-md p-3 shadow-sm hover:shadow-md transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <div className="rounded-full bg-primary w-7 h-7 text-center text-black p-1">
                      {comment.user.firstName[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {comment.user.firstName} {comment.user.lastName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {getFormattedDate(new Date(comment.createdAt), {
                          day: '2-digit',
                          month: 'short',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CornerDownLeft
                      onClick={() =>
                        setReplyComment((prev) =>
                          prev === comment.uuid ? null : comment.uuid,
                        )
                      }
                      className="w-5 h-5 cursor-pointer"
                    />
                    <CommentsActionsDropDown />
                  </div>
                </div>

                <p className="text-[15px] max-w-[250px] break-words whitespace-pre-wrap">
                  {comment.content}
                </p>

                {replyComment === comment.uuid && (
                  <ReplyCommentForm parentId={comment.uuid} noteId={noteId} />
                )}

                {comments
                  .filter((reply) => reply.parent?.uuid === comment.uuid)
                  .map((reply) => (
                    <div
                      key={reply.uuid}
                      className="ml-4 mt-3 border-l border-gray-300 pl-3 text-sm space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <div className="rounded-full bg-primary w-7 h-7 text-center text-black p-1">
                            {reply.user.firstName[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span>
                              {reply.user.firstName} {reply.user.lastName}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {getFormattedDate(new Date(reply.createdAt), {
                                day: '2-digit',
                                month: 'short',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </span>
                          </div>
                        </div>
                        <CommentsActionsDropDown />
                      </div>
                      <p>{reply.content}</p>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </ScrollArea>
    </aside>
  );
};
