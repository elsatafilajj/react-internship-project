import * as yup from 'yup';

export const ExportSchema = yup.object().shape({
  fileType: yup.string().required('Please select a format'),
});