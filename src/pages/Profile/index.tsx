import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { RouteNames } from '@/constants/routeNames';
import { useAuthContext } from '@/context/AuthContext/AuthContext';

export const Profile = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">User Profile</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account details
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">
              First Name
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {user.firstName}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">
              Last Name
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {user.lastName}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">
              Email
            </p>
            <p className="text-lg font-semibold text-gray-800 capitalize">
              {user.email}
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Link to={RouteNames.ResetPassword}>
            <Button className="w-full">Make Changes</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
