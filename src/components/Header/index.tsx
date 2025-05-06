import { Search, Bell, MoonIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Toggle } from '@/components/ui/toggle';
import { useAuthContext } from '@/context/AuthContext/AuthContext';

import LogoImg from '../../../public/logo-full.svg';

const routeNameMap: Record<string, string> = {
  '': 'Dashboard',
  profile: 'Profile',
  rooms: 'Rooms',
  notifications: 'Notifications',
  'reset-password': 'Reset Password',
  'forgot-password': 'Forgot Password',
  login: 'Login',
  register: 'Register',
};

export default function Topbar() {
  const { user, logout } = useAuthContext();
  const location = useLocation();

  const segments = location.pathname.split('/').filter(Boolean); // ['', 'profile'] → ['profile']

  return (
    <div className="flex bg-white flex-wrap justify-between items-center p-5 gap-4">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center gap-2">
          <BreadcrumbItem className="flex items-center gap-1">
            <BreadcrumbLink asChild>
              <Link to="/">
                <img src={LogoImg} alt="logo" className="max-w-[100px]" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {segments.map((segment, index) => {
            const fullPath = `/${segments.slice(0, index + 1).join('/')}`;
            const isLast = index === segments.length - 1;

            return (
              <div key={fullPath} className="flex items-center gap-1">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>
                      {routeNameMap[segment] || segment}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={fullPath}>
                        {routeNameMap[segment] || segment}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex gap-4 items-center">
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink>
                <Toggle aria-label="Toggle dark mode" className="rounded-full">
                  <MoonIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </Toggle>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/search">
                  <Search className="w-5 h-5" />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/notifications">
                  <Bell className="w-5 h-5" />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Link
          to="/profile"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{user?.firstName}</h3>
            <p className="text-xs text-muted-foreground">View Profile</p>
          </div>
        </Link>

        <Button onClick={logout} variant={'outline'} size="sm">
          Logout
        </Button>
      </div>
    </div>
  );
}
