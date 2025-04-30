import { useAuthContext } from '@/context/AuthContext/AuthContext';

export const CompanyDashboard = () => {
  const { user } = useAuthContext();

  return <div>Company Dashboard {user?.firstName}</div>;
};
