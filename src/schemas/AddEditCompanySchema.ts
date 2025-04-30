import { object, string } from 'yup';

export const AddEditCompanySchema = object().shape({
  name: string().required('Company name is required!'),
  address: string().required('Headquarters address is required!'),
  phoneNumber: string()
    .required('Phone number is required!')
    .matches(
      /^\+?[0-9\s-]+$/,
      'Phone number must contain only numbers, spaces, or hyphens',
    ),
  email: string()
    .required('Email is required!')
    .email('Please enter a valid email address'),
  website: string()
    .url('Please enter a valid website URL')
    .required('Website is required!'),
  customerId: string()
    .required('Customer ID is required!')
    .matches(
      /^[A-Za-z0-9-]+$/,
      'Customer ID must contain only letters, numbers, or hyphens',
    ),
  // taxId: string()
  //   .required('Tax ID is required!')
  //   .matches(
  //     /^[A-Za-z0-9-]+$/,
  //     'Tax ID must contain only letters, numbers, or hyphens',
  //   ),
  accountStatus: string().required('Account status is required!'),
  industryType: string().required('Industry type is required!'),
  // operationalRegions: array()
  //   .of(string().required('Each operational region is required!'))
  //   .min(1, 'At least one operational region is required'),
  // facilities: array()
  //   .of(string().required('Each facility is required!'))
  //   .min(1, 'At least one facility is required'),

  // billingDetails: object().shape({
  //   name: string().required('Billing name is required!'),
  //   address: string().required('Billing address is required!'),
  //   phone: string()
  //     .required('Billing phone number is required!')
  //     .matches(
  //       /^\+?[0-9\s-]+$/,
  //       'Billing phone number must contain only numbers, spaces, or hyphens',
  //     ),
  //   email: string()
  //     .required('Billing email is required!')
  //     .email('Please enter a valid billing email address'),
  // }),
});
