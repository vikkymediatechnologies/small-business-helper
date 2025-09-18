import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import Dashboard from '../components/dashboard/Dashboard';
import SalesForm from '../components/sales/SalesForm';
import InventoryManager from '../components/inventory/InventoryManager';
import DebtManager from '../components/debts/DebtManager';
import Reports from '../components/reports/Reports';
import Settings from '../components/settings/Settings';
import Sidebar from '../components/layout/Sidebar';
import MobileNav from '../components/layout/MobileNav';

const AppPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Redirect to dashboard after successful authentication
  React.useEffect(() => {
    if (user && authMode === 'register') {
      // Small delay to ensure toast is visible before redirect
      setTimeout(() => {
        setActiveTab('dashboard');
      }, 1000);
    }
  }, [user, authMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'sales':
        return <SalesForm />;
      case 'inventory':
        return <InventoryManager />;
      case 'debts':
        return <DebtManager />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 pb-16 md:pb-0">
        {renderContent()}
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default AppPage;