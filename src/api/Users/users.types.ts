export enum CompanyUserStatus {
  Active = 'Active',
  Suspended = 'Suspended',
  Deactivated = 'Deactivated',
}

export interface CompanyUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  phoneNumber: string;
  image: string;
  companyName: string;
  companyEmail: string;
  branchLocation: string;
  accountStatus: CompanyUserStatus;
}

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
}
