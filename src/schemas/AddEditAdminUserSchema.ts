import { object, string } from 'yup';

enum AccountStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export const AddEditAdminUserSchema = object().shape({
  firstName: string().required('First name is required!'),
  lastName: string().required('Last name is required!'),
  email: string()
    .required('Email is required!')
    .email('Please enter a valid email address'),
  roleType: string().required('Role is required!'),
  department: string().required('Department is required!'),
  phoneNumber: string()
    .required('Phone number is required!')
    .matches(/^[0-9]+$/, 'Phone number must be digits only'),
  image: string().optional(),
  accountStatus: string()
    .oneOf(Object.values(AccountStatus), 'Invalid account status')
    .required('Account status is required!'),
  // assignedRole: string().required('Assigned role is required!'),
  // permissions: array().of(string()).required('Permissions are required!'),
});
