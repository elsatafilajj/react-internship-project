import { FormikHelpers, useFormik } from 'formik';
import { AnySchema } from 'yup';

interface UseFormOptions<T> {
  initialValues?: T;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void;
  schema: AnySchema;
  enableReinitialize?: boolean;
}

export const useForm = <T extends object>({
  initialValues,
  onSubmit,
  schema,
  enableReinitialize = true,
}: UseFormOptions<T>) => {
  return useFormik<T>({
    initialValues: initialValues || ({} as T),
    validateOnBlur: false,
    validateOnChange: true,
    validationSchema: schema,
    onSubmit,
    enableReinitialize,
  });
};

export type FormikForm = ReturnType<typeof useForm>;
