import { createRootRoute, Outlet, Link, useRouterState } from '@tanstack/react-router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LayoutDashboard, Users, UserCircle, Briefcase, Mail, Settings, ShieldAlert, LogOut } from 'lucide-react'

const queryClient = new QueryClient()

function Sidebar() {
  const { logout } = useAuth();
  const router = useRouterState();
  
  if (router.location.pathname === '/login') {
    return null;
  }

  return (
    <div className="w-sidebar h-screen fixed left-0 top-0 bg-white border-r border-border flex flex-col">
      <div className="p-6 font-bold text-xl text-text border-b border-border">HomeBy Admin</div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-page rounded-md" activeProps={{ className: 'bg-page text-accent font-medium' }}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/integrations" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-page rounded-md" activeProps={{ className: 'bg-page text-accent font-medium' }}>
          <Settings size={20} /> Integrations
        </Link>
        <Link to="/agencies" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-page rounded-md" activeProps={{ className: 'bg-page text-accent font-medium' }}>
          <Briefcase size={20} /> Agencies
        </Link>
        <Link to="/agents" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-page rounded-md" activeProps={{ className: 'bg-page text-accent font-medium' }}>
          <UserCircle size={20} /> Agents
        </Link>
        <Link to="/applications" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-page rounded-md" activeProps={{ className: 'bg-page text-accent font-medium' }}>
          <ShieldAlert size={20} /> Applications
        </Link>
        <Link to="/email-templates" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-page rounded-md" activeProps={{ className: 'bg-page text-accent font-medium' }}>
          <Mail size={20} /> Email Templates
        </Link>
        <Link to="/staff" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-page rounded-md" activeProps={{ className: 'bg-page text-accent font-medium' }}>
          <Users size={20} /> Staff & Roles
        </Link>
      </nav>
      <div className="p-4 border-t border-border">
        <button onClick={logout} className="flex w-full items-center gap-3 px-3 py-2 text-danger hover:bg-red-50 rounded-md">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  )
}

function RootComponent() {
  const router = useRouterState();
  const isLogin = router.location.pathname === '/login';

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-page flex">
          <Sidebar />
          <main className={`flex-1 ${!isLogin ? 'ml-sidebar' : ''} p-6 max-w-content mx-auto w-full`}>
            <Outlet />
          </main>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
