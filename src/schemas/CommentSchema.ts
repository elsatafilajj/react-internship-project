import { object, string } from 'yup';

export const CommentSchema = object().shape({
  content: string()
    .required('Comment is required!')
    .min(2, 'Too Short')
    .max(100, 'Too Long')
    .trim(),
});
