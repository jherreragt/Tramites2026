import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  LogOut, 
  Menu, 
  X,
  Home,
  BarChart2,
  Target,
  Settings as SettingsIcon 
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminLayout: React.FC = () => {
  const { user, isLoading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Trámites', href: '/admin/procedures', icon: FileText },
    { name: 'Instituciones', href: '/admin/institutions', icon: Building2 },
    { name: 'Experiencias', href: '/admin/experiences', icon: Target },
    { name: 'Observatorio', href: '/admin/observatory', icon: BarChart2 },
    { name: 'Configuración', href: '/admin/settings', icon: SettingsIcon },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const Sidebar = () => (
    <div className="h-screen sticky top-0 flex flex-col bg-slate-900 text-white w-64 overflow-y-auto">
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        <span className="text-xl font-bold">Admin Panel</span>
        <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
          <X className="w-6 h-6 text-slate-400 hover:text-white" />
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
                           (item.href !== '/admin' && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <Link 
          to="/" 
          className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white mb-2"
        >
          <Home className="mr-3 flex-shrink-0 h-5 w-5" />
          Ver Sitio Público
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center px-4 py-2 text-sm font-medium rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
        >
          <LogOut className="mr-3 flex-shrink-0 h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex flex-col z-40">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Main Area */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
