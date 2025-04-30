import { useAuthContext } from '@/context/AuthContext/AuthContext';

export const AdminDashboard = () => {
  const { user } = useAuthContext();

  return <div>Hello AdminDashboard {user?.firstName}</div>;
};
