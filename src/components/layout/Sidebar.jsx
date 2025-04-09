import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LogOutIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { navLink } from '@/constants/navLink';
import { toastError } from '@/lib/toast';
import { useLogoutMutation } from '@/queries/useAuth';

export function Sidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const { logout } = useAppContext();
  const { mutateAsync: logoutMutation } = useLogoutMutation();
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation(); // Thực hiện gọi API logout
      logout(); // Xóa token hoặc trạng thái đăng nhập phía client
    } catch (error) {
      toastError(error.message || 'Logout failed');
    }
  };

  return (
    <div
      className={cn(
        'h-screen bg-background border-r fixed left-0 top-0 flex flex-col transition-all duration-200',
        isCollapsed ? 'w-16 p-2' : 'w-64 p-4',
      )}
    >
      <div
        className={cn(
          'flex justify-between items-center mb-8',
          isCollapsed && 'justify-center',
        )}
      >
        {!isCollapsed && <h2 className="text-2xl font-bold">Real-estate</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="w-8 h-8"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpenIcon className="w-4 h-4" />
          ) : (
            <PanelLeftCloseIcon className="w-4 h-4" />
          )}
        </Button>
      </div>

      <nav className="flex-grow space-y-1">
        {navLink.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            title={isCollapsed ? item.label : ''}
          >
            <Button
              variant={location.pathname === item.href ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start text-left',
                location.pathname === item.href ? 'bg-accent' : '',
                isCollapsed && 'justify-center p-2',
              )}
            >
              <item.icon className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
              {!isCollapsed && item.label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="pt-4 mt-auto border-t">
        <Button
          variant="ghost"
          className={cn(
            'w-full text-destructive hover:text-destructive',
            isCollapsed ? 'justify-center p-2' : 'justify-start text-left',
          )}
          onClick={handleLogout}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOutIcon className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
          {!isCollapsed && 'Logout'}
        </Button>
      </div>
    </div>
  );
}
