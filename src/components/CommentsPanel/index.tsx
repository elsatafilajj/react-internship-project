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
import { socketEvents } from '@/constants/socketEvents';
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
  const [editingComment, setEditingComment] =
    useState<NoteCommentResponse | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const [replyComment, setReplyComment] = useState<string | null>(null);
  const socket = getSocket();
  const { roomId } = useParams<{ roomId: string }>();
  const { data, isFetched } = useGetAllCommentsQuery(noteId);

  const createFormik = useForm({
    schema: CommentSchema,
    initialValues: {
      noteId,
      content: '',
      parent: null,
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        socket.emit(socketEvents.CreateComment, {
          roomId: roomId,
          payload: values,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.getCommentsByNoteId(noteId),
        });
        formikHelpers.resetForm();
      } catch {
        console.error('Failed to create comment');
      }
    },
  });

  const editFormik = useForm({
    schema: CommentSchema,
    initialValues: {
      noteId,
      content: '',
    },
    onSubmit: async (values, formikHelpers) => {
      if (!editingComment) return;

      try {
        socket.emit(socketEvents.UpdateComment, {
          roomId: roomId,
          commentId: editingComment.uuid,
          payload: values,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.getCommentsByNoteId(noteId),
        });
        formikHelpers.resetForm();
        setEditingComment(null);
      } catch (error) {
        console.error('Failed to edit comment', error);
      }
    },
  });

  useEffect(() => {
    if (isFetched && data) {
      setComments(data.data);
    }
  }, [data, isFetched]);

  useEffect(() => {
    socket.on(socketEvents.CreatedComment, (newComment) => {
      console.log('Received new comment:', newComment);
      if (noteId === newComment.note.uuid) {
        setComments((prev) => [...(prev || []), newComment]);
      }
    });

    socket.on(socketEvents.UpdatedComment, (newComment) => {
      if (noteId === newComment.noteId) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.uuid === newComment.uuid
              ? { ...comment, content: newComment.content }
              : comment,
          ),
        );
      }
    });

    socket.on(socketEvents.DeletedComment, (deletedComment) =>
      setComments((prev) =>
        prev.filter((comment) => comment.uuid !== deletedComment.resourceId),
      ),
    );

    return () => {
      socket.off(socketEvents.CreatedComment);
      socket.off(socketEvents.UpdatedComment);
      socket.off(socketEvents.DeletedComment);
    };
  }, []);

  const startEditing = (comment: NoteCommentResponse) => {
    setEditingComment(comment);
    editFormik.setFieldValue('content', comment.content);
  };

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
            {editingComment ? (
              <form
                onSubmit={editFormik.handleSubmit}
                className="flex items-center gap-2"
              >
                <Input
                  id="content"
                  name="content"
                  type="text"
                  placeholder="edit a comment..."
                  value={editFormik.values.content}
                  onChange={editFormik.handleChange}
                  error={getFormikError(editFormik, 'content')}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={createFormik.isSubmitting}
                  size="sm"
                  className="bg-primary text-black"
                >
                  <SendHorizontal />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditingComment(null)}
                >
                  Cancel
                </Button>
              </form>
            ) : (
              <form
                onSubmit={createFormik.handleSubmit}
                className="flex items-center gap-2"
              >
                <Input
                  id="content"
                  name="content"
                  type="text"
                  placeholder="Write a comment..."
                  value={createFormik.values.content}
                  onChange={createFormik.handleChange}
                  error={getFormikError(createFormik, 'content')}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={createFormik.isSubmitting}
                  size="sm"
                  className="bg-primary text-black"
                >
                  <SendHorizontal />
                </Button>
              </form>
            )}
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
                    <CommentsActionsDropDown
                      roomId={roomId}
                      noteId={noteId}
                      commentId={comment.uuid}
                      onEdit={() => startEditing(comment)}
                    />
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
                        <CommentsActionsDropDown
                          roomId={roomId}
                          noteId={noteId}
                          commentId={reply.uuid}
                          parentId={comment.uuid}
                          onEdit={() => startEditing(reply)}
                        />
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
