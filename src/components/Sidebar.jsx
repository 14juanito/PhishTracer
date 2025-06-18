import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiMail, FiSettings, FiShield } from 'react-icons/fi';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Tableau de bord' },
    { path: '/url-scanner', icon: FiSearch, label: 'Scanner d\'URL' },
    { path: '/email-scanner', icon: FiMail, label: 'Scanner de courriels' },
    { path: '/settings', icon: FiSettings, label: 'Paramètres' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 hidden lg:block">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/assets/logo.png" alt="PhishTracer" className="h-8 w-auto" />
        </Link>
      </div>

      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
} 