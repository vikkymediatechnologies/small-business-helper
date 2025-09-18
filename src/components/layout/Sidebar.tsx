import React from 'react';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'sales', label: 'Add Sale', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'debts', label: 'Debts', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="bg-white shadow-sm border-r border-gray-200 w-64 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Small Business Helper</h1>
            <p className="text-xs text-gray-500">{user?.businessName}</p>
          </div>
        </div>
      </div>

{/* Pro Badge */}
{!user?.isPro && (
  <div className="mx-4 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3 text-white">
    <div className="flex items-center gap-2 mb-2">
      <Crown className="h-4 w-4" />
      <span className="text-sm font-medium">Upgrade to Pro</span>
    </div>
    <p className="text-xs opacity-90 mb-3">
      Get receipts, cloud backup, and advanced reports
    </p>
    <button
      onClick={() => {
        // Simulate upgrade - in real app this would integrate with payment processor
        if (window.confirm("Upgrade to Pro for ₦2,000/month?\n\n✅ Cloud backup\n✅ PDF & WhatsApp receipts\n✅ Advanced reports\n✅ Multi-user access\n✅ WhatsApp reminders\n\n(This is a demo - no actual payment required)")) {
          updateUser({ isPro: true });
          toast.success('🎉 Congratulations! You have successfully upgraded to Pro! All premium features are now unlocked.', {
            duration: 5000,
          });
        }
      }}
      className="bg-white text-blue-600 text-xs px-3 py-1 rounded font-medium hover:bg-gray-100 transition-colors"
    >
      Upgrade Now
    </button>
  </div>
)}


      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {user?.businessName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.businessName}</p>
            <p className="text-xs text-gray-500">{user?.phone}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;