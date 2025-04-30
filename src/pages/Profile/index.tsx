import { useAuthContext } from '@/context/AuthContext/AuthContext';

export const Profile = () => {
  const { user } = useAuthContext();

  return <div>Profile {user?.firstName}</div>;
};
