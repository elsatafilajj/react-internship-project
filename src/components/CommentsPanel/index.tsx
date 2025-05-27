import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SendHorizontal, CornerDownLeft } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { createNewComment } from '@/api/Comments/comments.client';
import { useGetAllCommentsQuery } from '@/api/Comments/comments.queries';
import { CommentsActionsDropDown } from '@/components/CommentsActionDropDown';
import { ReplyCommentForm } from '@/components/ReplyCommentForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { queryKeys } from '@/constants/queryKeys';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { getFormattedDate } from '@/helpers/getFormattedDate';
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { CommentSchema } from '@/schemas/CommentSchema';

interface CommentsPanelProps {
  noteId: string;
}

export const CommentsPanel = ({ noteId }: CommentsPanelProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const [replyComment, setReplyComment] = useState<string | null>(null);

  const { data } = useGetAllCommentsQuery(noteId);

  const commentsMutation = useMutation({
    mutationFn: createNewComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getCommentsByNoteId(noteId),
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formik = useForm({
    schema: CommentSchema,
    initialValues: {
      noteId: noteId,
      content: '',
      parent: null,
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        await commentsMutation.mutateAsync(values);
        formikHelpers.resetForm();
      } catch {
        console.error('comment creation failed');
      }
    },
  });

  return (
    <aside className="w-full bg-card h-screen text-card-revert flex flex-col">
      <Tabs defaultValue="comments" className="flex flex-col flex-1 mt-7">
        <TabsContent value="comments" className="flex-1">
          <ScrollArea className="h-full p-4 space-y-4">
            <div className="space-y-4">
              <div className="border rounded-md p-3 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <div className="rounded-full bg-primary w-7 h-7 text-center text-black p-1">
                    {user?.firstName[0].toUpperCase()}
                  </div>
                  {user?.firstName} {user?.lastName}
                </div>
                <form onSubmit={formik.handleSubmit} className="flex">
                  <Input
                    id="content"
                    name="content"
                    type="text"
                    placeholder="comment here..."
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    error={getFormikError(formik, 'content')}
                    className="relative w-[230px] tracking-wide"
                  />

                  <Button
                    size="sm"
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="bg-card text-foreground "
                  >
                    <SendHorizontal type="submit" />
                  </Button>
                </form>
              </div>
              {data?.data
                .filter((comment) => !comment.parent)
                .map((comment) => (
                  <div
                    key={comment.uuid}
                    className="border rounded-md p-3 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <div className="rounded-full bg-primary w-7 h-7 text-center text-black p-1">
                          {user?.firstName[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col mt-1">
                          {user?.firstName} {user?.lastName}
                          <span className="text-[10px] text-foreground pl-0">
                            {getFormattedDate(new Date(comment.createdAt), {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}{' '}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CornerDownLeft
                          onClick={() =>
                            setReplyComment((prevComment) =>
                              prevComment === comment.uuid
                                ? null
                                : comment.uuid,
                            )
                          }
                          className="w-5 h-5"
                        />
                        <CommentsActionsDropDown />
                      </div>
                    </div>
                    <p className="text-[15px]">{comment.content}</p>

                    {replyComment === comment.uuid && (
                      <>
                        <ReplyCommentForm
                          parentId={comment.uuid}
                          noteId={noteId}
                        />

                        {data?.data
                          .filter(
                            (reply) => reply.parent?.uuid === comment.uuid,
                          )
                          .map((reply) => (
                            <div
                              key={reply.uuid}
                              className="ml-1 mt-3 border-l border-gray-300 pl-3 text-sm"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                  <div className="rounded-full bg-primary w-7 h-7 text-center text-black p-1">
                                    {user?.firstName[0].toUpperCase()}
                                  </div>
                                  {user?.firstName} {user?.lastName}
                                </div>
                                <CommentsActionsDropDown />
                              </div>
                              <p className="mr-2">{reply.content}</p>
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  );
};
