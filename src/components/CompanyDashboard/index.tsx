import { useAuthContext } from '@/context/AuthContext/AuthContext';

import { Button } from '../ui/button';

export const CompanyDashboard = () => {
  const { user, logout } = useAuthContext();

  return (
    <div>
      Company Dashboard {user?.firstName}
      <Button
        onClick={() => {
          logout();
        }}
      >
        Logout
      </Button>
    </div>
  );
};
