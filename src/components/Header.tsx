import React from 'react';
import { AlertTriangle, Home, List, BarChart, LogOut, UserPlus, PlusCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../api/auth';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, isEmployee, setUser } = useAuth();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  const navigation = [
    { name: 'Início', href: '/', icon: Home, show: true },
    { name: 'Novo Relato', href: '/reports/new', icon: PlusCircle, show: isAuthenticated && !isAdmin && !isEmployee },
    { name: 'Meus Relatos', href: '/reports', icon: List, show: isAuthenticated },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart, show: isEmployee || isAdmin },
    { name: 'Admin', href: '/admin', icon: BarChart, show: isAdmin },
  ].filter(item => item.show);

  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Relato de Problemas
              </span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <nav className="flex space-x-4">
              {navigation.map(({ name, href, icon: Icon }) => (
                <Link
                  key={name}
                  to={href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    location.pathname === href
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-1.5" />
                  {name}
                </Link>
              ))}
            </nav>

            <div className="ml-4 flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-150"
                  >
                    <LogOut className="h-4 w-4 mr-1.5" />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-150"
                  >
                    <UserPlus className="h-4 w-4 mr-1.5" />
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}