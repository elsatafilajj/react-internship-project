import { House, List, Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

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
import { useAuthContext } from '@/context/AuthContext/AuthContext';

export default function Topbar() {
  const { user, logout } = useAuthContext();

  return (
    <div className="flex bg-white flex-wrap justify-between items-center p-5 gap-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList className="flex items-center gap-2">
          <BreadcrumbItem className="flex items-center gap-1">
            <House className="w-4 h-4" />
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="flex items-center gap-1">
            <List className="w-4 h-4" />
            <BreadcrumbPage>Data List</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Navigation & Profile */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Navigation Menu Icons */}
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/search">
                  <Search className="w-5 h-5" />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {/* <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/messages">
                  <MessageSquare className="w-5 h-5" />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem> */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/notifications">
                  <Bell className="w-5 h-5" />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* User Info */}
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

        {/* Logout Button */}
        <Button onClick={logout} variant="outline" size="sm">
          Logout
        </Button>
      </div>
    </div>
  );
}
