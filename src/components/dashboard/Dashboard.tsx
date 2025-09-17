import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  TrendingUp,
  AlertTriangle,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProducts, useSales, useDebts } from '../../hooks/useSupabaseData';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { user, updateUser } = useAuth();
  const { products, refetch: refetchProducts } = useProducts();
  const { sales, refetch: refetchSales } = useSales();
  const { debts, refetch: refetchDebts } = useDebts();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchProducts(),
        refetchSales(),
        refetchDebts()
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate dashboard stats
  const todaySales = sales.filter(sale => {
    const today = new Date().toDateString();
    return new Date(sale.created_at).toDateString() === today;
  });

  const totalTodaySales = todaySales.reduce((sum, sale) => sum + sale.total_amount, 0);
  const totalDebts = debts.filter(debt => !debt.is_paid).reduce((sum, debt) => sum + debt.amount, 0);
  const lowStockItems = products.filter(product => product.quantity <= product.low_stock_alert);
  const totalProducts = products.length;

  const stats = [
    {
      title: "Today's Sales",
      value: `₦${totalTodaySales.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: `${todaySales.length} transactions`
    },
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      icon: Package,
      color: 'bg-blue-500',
      change: `${lowStockItems.length} low stock`
    },
    {
      title: 'Outstanding Debts',
      value: `₦${totalDebts.toLocaleString()}`,
      icon: Users,
      color: 'bg-orange-500',
      change: `${debts.filter(d => !d.is_paid).length} customers`
    },
    {
      title: 'Monthly Sales',
      value: `₦${sales.reduce((sum, sale) => sum + sale.total_amount, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: `${sales.length} total sales`
    }
  ];

  const quickActions = [
    {
      title: 'Add Sale',
      description: 'Record a new sale',
      icon: ShoppingCart,
      color: 'bg-green-500',
      action: () => setActiveTab('sales')
    },
    {
      title: 'Add Product',
      description: 'Add new inventory',
      icon: Package,
      color: 'bg-blue-500',
      action: () => setActiveTab('inventory')
    },
    {
      title: 'View Debts',
      description: 'Manage customer debts',
      icon: Users,
      color: 'bg-orange-500',
      action: () => setActiveTab('debts')
    },
    {
      title: 'Reports',
      description: 'View business reports',
      icon: BarChart3,
      color: 'bg-purple-500',
      action: () => setActiveTab('reports')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome back, {user?.businessName}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-NG', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              {!user?.isPro && (
                <button 
                  onClick={() => updateUser({ isPro: true })}
                  onClick={() => {
                    if (confirm('Upgrade to Pro for ₦2,000/month?\n\n✅ Cloud backup & sync\n✅ PDF & WhatsApp receipts\n✅ Advanced profit reports\n✅ Multi-user access\n✅ WhatsApp reminders\n✅ Priority support\n\n(Demo mode - no payment required)')) {
                      updateUser({ isPro: true });
                      alert('🎉 Welcome to Pro!\n\nYour account has been upgraded successfully!\n\nNew features unlocked:\n• Export business reports\n• Advanced analytics dashboard\n• Priority customer support\n\nStart exploring your new Pro features now!');
                    }
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Upgrade to Pro
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <h3 className="font-medium text-orange-800">Low Stock Alert</h3>
                <p className="text-sm text-orange-700">
                  {lowStockItems.length} product(s) are running low: {lowStockItems.map(p => p.name).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all text-left group"
              >
                <div className={`${action.color} p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h2>
          {todaySales.length > 0 ? (
            <div className="space-y-3">
              {todaySales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{sale.product_name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {sale.quantity} × ₦{sale.unit_price.toLocaleString()}
                      {sale.customer_name && ` • ${sale.customer_name}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₦{sale.total_amount.toLocaleString()}</p>
                    <p className={`text-xs ${sale.is_paid ? 'text-green-600' : 'text-orange-600'}`}>
                      {sale.is_paid ? 'Paid' : 'Debt'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No sales recorded today</p>
              <button
                onClick={() => setActiveTab('sales')}
                className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Record your first sale
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;