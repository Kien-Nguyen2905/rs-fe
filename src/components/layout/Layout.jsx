import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { useMeQuery } from '@/queries/useAuth';

export function Layout() {
  const { isCollapsed, setIsCollapsed, setUser } = useAppContext();
  const { data: meData } = useMeQuery();

  useEffect(() => {
    if (meData?.data) {
      setUser(meData.data);
    }
  }, [meData, setUser]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={cn(
          'transition-all duration-200',
          isCollapsed ? 'pl-16' : 'pl-64',
        )}
      >
        <main className="container px-4 py-6 mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
