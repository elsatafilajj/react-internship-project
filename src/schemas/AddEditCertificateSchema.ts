import { object, string, date } from 'yup';

export const AddEditCertificateSchema = object().shape({
  id: string().required('Certificate ID/Number is required!'),
  certificateType: string().required('Certificate type is required!'),
  issuingAuthority: string().required('Issuing Authority by is required!'),
  issuedDate: date().nullable().required('Issued date is required!'),
  expiryDate: date().nullable().required('Expiration date is required!'),
  status: string().required('Status is required!'),
});
