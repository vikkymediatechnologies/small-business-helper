import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Phone, Store, Crown, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Update user data in localStorage
    const savedUser = JSON.parse(localStorage.getItem('sbh_user') || '{}');
    const updatedUser = { ...savedUser, businessName };
    localStorage.setItem('sbh_user', JSON.stringify(updatedUser));
    
    // Update users list
    const users = JSON.parse(localStorage.getItem('sbh_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user?.id ? { ...u, businessName } : u
    );
    localStorage.setItem('sbh_users', JSON.stringify(updatedUsers));
    
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gray-500 p-2 rounded-lg">
          <SettingsIcon className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{user?.phone}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <div className="flex items-center gap-3">
                <Store className="h-4 w-4 text-gray-400" />
                {isEditing ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSave}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setBusinessName(user?.businessName || '');
                        setIsEditing(false);
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-gray-900">{user?.businessName}</span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Subscription
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                {user?.isPro ? 'Pro Plan' : 'Free Plan'}
              </p>
              <p className="text-sm text-gray-500">
                {user?.isPro 
                  ? 'You have access to all premium features' 
                  : 'Upgrade to unlock premium features'
                }
              </p>
            </div>
            {!user?.isPro && (
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium">
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Management
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Export Data</p>
                <p className="text-sm text-gray-500">Download your business data</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Export
              </button>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Clear All Data</p>
                <p className="text-sm text-gray-500">Remove all sales, products, and debts</p>
              </div>
              <button 
                onClick={() => {
                  if (confirm('Are you sure? This action cannot be undone.')) {
                    localStorage.removeItem('sbh_products');
                    localStorage.removeItem('sbh_sales');
                    localStorage.removeItem('sbh_debts');
                    window.location.reload();
                  }
                }}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Sign Out</p>
              <p className="text-sm text-gray-500">Sign out of your account</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;