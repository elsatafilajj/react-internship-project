// import { UserRole } from '@/api/User/user.types';
import { AdminDashboard } from '@/components/AdminDashboard';
import { CompanyDashboard } from '@/components/CompanyDashboard';

// import { useAuthContext } from '@/context/AuthContext/AuthContext';

export const Dashboard = () => {
  // const { user } = useAuthContext();
  // const isRoleAdmin = user?.role === UserRole.Admin;
  const isRoleAdmin = false;

  return isRoleAdmin ? <AdminDashboard /> : <CompanyDashboard />;
};
