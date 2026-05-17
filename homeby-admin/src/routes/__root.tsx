import { createRootRoute, Outlet, Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LayoutDashboard, Users, UserCircle, Briefcase, Mail, Settings, ShieldAlert, LogOut } from 'lucide-react'
import { useEffect } from 'react'

const queryClient = new QueryClient()

function Sidebar() {
  const { logout, role } = useAuth();
  const router = useRouterState();
  
  if (router.location.pathname === '/login') {
    return null;
  }

  // 3.4 Role-based UI: Only superadmin sees specific items like Audit Log or similar if defined.
  // In the sidebar, all users see the main items, but we implement basic guards.
  return (
    <div className="w-sidebar h-screen fixed left-0 top-0 bg-white border-r border-border flex flex-col">
      <div className="p-6 font-bold text-xl text-text border-b border-border">HomeBy Admin</div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-page rounded-md transition-colors" activeProps={{ className: 'bg-page text-accent font-medium' }}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/integrations" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-page rounded-md transition-colors" activeProps={{ className: 'bg-page text-accent font-medium' }}>
          <Settings size={20} /> Integrations
        </Link>
        <Link to="/agencies" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-page rounded-md transition-colors" activeProps={{ className: 'bg-page text-accent font-medium' }}>
          <Briefcase size={20} /> Agencies
        </Link>
        <Link to="/agents" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-page rounded-md transition-colors" activeProps={{ className: 'bg-page text-accent font-medium' }}>
          <UserCircle size={20} /> Agents
        </Link>
        <Link to="/applications" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-page rounded-md transition-colors" activeProps={{ className: 'bg-page text-accent font-medium' }}>
          <ShieldAlert size={20} /> Applications
        </Link>
        <Link to="/email-templates" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-page rounded-md transition-colors" activeProps={{ className: 'bg-page text-accent font-medium' }}>
          <Mail size={20} /> Email Templates
        </Link>
        {role === 'superadmin' && (
          <Link to="/staff" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-page rounded-md transition-colors" activeProps={{ className: 'bg-page text-accent font-medium' }}>
            <Users size={20} /> Staff & Roles
          </Link>
        )}
      </nav>
      <div className="p-4 border-t border-border">
        <button onClick={logout} className="flex w-full items-center gap-3 px-3 py-2 text-danger hover:bg-red-50 rounded-md transition-colors">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  )
}

function AppLayout() {
  const { accessToken } = useAuth();
  const router = useRouterState();
  const navigate = useNavigate();
  const isLogin = router.location.pathname === '/login';

  useEffect(() => {
    // If not authenticated and trying to access an authenticated route
    if (!accessToken && !isLogin) {
      navigate({ to: '/login', replace: true });
    }
    // If authenticated and trying to access login page
    else if (accessToken && isLogin) {
      navigate({ to: '/dashboard', replace: true });
    }
  }, [accessToken, isLogin, navigate]);

  // Render loading indicator during auth redirect to prevent flash
  if (!accessToken && !isLogin) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page flex w-full">
      <Sidebar />
      <main className={`flex-1 ${!isLogin ? 'ml-sidebar' : ''} p-6 max-w-content mx-auto w-full`}>
        <Outlet />
      </main>
    </div>
  );
}

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
