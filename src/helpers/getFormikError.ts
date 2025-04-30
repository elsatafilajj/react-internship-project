import { FormikProps } from 'formik';

export const getFormikError = <T>(formik: FormikProps<T>, field: keyof T) => {
  if (formik.touched[field] && formik.errors[field]) {
    return formik.errors[field];
  } else {
    return '';
  }
};
