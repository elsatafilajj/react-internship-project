// import { SVGProps } from 'react';
import { UserRole } from '@/api/User/user.types';

// import { DashboardIcon } from '@/assets/icons/general/Dashboard';

// import { RouteNames } from './routeNames';

interface MenuItem {
  type: 'single' | 'submenu';
  label: string;
  //   link: string;
  //   icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

const adminMenuItems: MenuItem[] = [
  {
    type: 'single',
    label: 'Dashboard',
    // link: RouteNames.Dashboard,
    // icon: DashboardIcon,
  },
];

const companyMenuItems: MenuItem[] = [
  {
    type: 'single',
    label: 'Dashboard',
    // link: RouteNames.Dashboard,
    // icon: DashboardIcon,
  },
];

export const getMenuItemsByRole = (role: UserRole) => {
  return role === UserRole.Host ? adminMenuItems : companyMenuItems;
};
