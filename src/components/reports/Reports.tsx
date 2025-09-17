import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, Calendar, Download, FileText } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Sale, Product } from '../../types';
import { useAuth } from '../../context/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [sales] = useLocalStorage<Sale[]>('sbh_sales', []);
  const [products] = useLocalStorage<Product[]>('sbh_products', []);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isExporting, setIsExporting] = useState(false);

  const exportReport = async () => {
    setIsExporting(true);
    try {
      const reportContent = `
SMALL BUSINESS HELPER - ${period.toUpperCase()} REPORT
Business: ${user?.businessName}
Generated: ${new Date().toLocaleString()}

SALES SUMMARY
Total Sales: ₦${reportData.totalSales.toLocaleString()}
Total Profit: ₦${reportData.totalProfit.toLocaleString()}
Paid Sales: ₦${reportData.totalPaid.toLocaleString()}
Outstanding Debts: ₦${reportData.totalDebts.toLocaleString()}
Number of Transactions: ${reportData.salesCount}
Profit Margin: ${reportData.profitMargin.toFixed(1)}%

TOP SELLING PRODUCTS
${reportData.topProducts.map((product, index) => 
  `${index + 1}. ${product.name} - ${product.quantity} units - ₦${product.revenue.toLocaleString()}`
).join('\n')}
      `.trim();
      
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${period}-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert(`✅ Report exported successfully!\n\nYour ${period} business report has been downloaded.\n\nFile: ${period}-report-${new Date().toISOString().split('T')[0]}.txt\n\nThis is a Pro feature - thank you for upgrading!`);
    } catch (error) {
      alert('❌ Export failed!\n\nUnable to export report. Please try again or contact support if the issue persists.');
    } finally {
      setIsExporting(false);
    }
  };

  const reportData = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const filteredSales = sales.filter(sale => new Date(sale.createdAt) >= startDate);
    
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalProfit = filteredSales.reduce((sum, sale) => {
      const product = products.find(p => p.id === sale.productId);
      if (product) {
        return sum + ((sale.unitPrice - product.costPrice) * sale.quantity);
      }
      return sum;
    }, 0);
    
    const paidSales = filteredSales.filter(sale => sale.isPaid);
    const debtSales = filteredSales.filter(sale => !sale.isPaid);
    
    const totalPaid = paidSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalDebts = debtSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    // Top selling products
    const productSales = filteredSales.reduce((acc, sale) => {
      if (!acc[sale.productId]) {
        acc[sale.productId] = {
          name: sale.productName,
          quantity: 0,
          revenue: 0
        };
      }
      acc[sale.productId].quantity += sale.quantity;
      acc[sale.productId].revenue += sale.totalAmount;
      return acc;
    }, {} as Record<string, { name: string; quantity: number; revenue: number }>);

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalSales,
      totalProfit,
      totalPaid,
      totalDebts,
      salesCount: filteredSales.length,
      topProducts,
      profitMargin: totalSales > 0 ? (totalProfit / totalSales) * 100 : 0
    };
  }, [sales, products, period]);

  const stats = [
    {
      title: 'Total Sales',
      value: `₦${reportData.totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: `${reportData.salesCount} transactions`
    },
    {
      title: 'Total Profit',
      value: `₦${reportData.totalProfit.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-blue-500',
      change: `${reportData.profitMargin.toFixed(1)}% margin`
    },
    {
      title: 'Paid Sales',
      value: `₦${reportData.totalPaid.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: 'Cash received'
    },
    {
      title: 'Outstanding Debts',
      value: `₦${reportData.totalDebts.toLocaleString()}`,
      icon: Package,
      color: 'bg-orange-500',
      change: 'To be collected'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500 p-2 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Business Reports</h2>
        </div>
        
        {/* Period Selector */}
        <div className="flex gap-2 items-center">
          {user?.isPro && (
            <button
              onClick={exportReport}
              disabled={isExporting}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2 mr-4"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          )}
          <button
            onClick={() => setPeriod('daily')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === 'daily' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === 'weekly' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === 'monthly' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          {reportData.topProducts.length > 0 ? (
            <div className="space-y-4">
              {reportData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.quantity} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₦{product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No sales data available</p>
            </div>
          )}
        </div>

        {/* Sales Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Total Transactions</span>
              <span className="font-medium text-gray-900">{reportData.salesCount}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Average Sale</span>
              <span className="font-medium text-gray-900">
                ₦{reportData.salesCount > 0 ? (reportData.totalSales / reportData.salesCount).toLocaleString() : '0'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Profit Margin</span>
              <span className="font-medium text-green-600">{reportData.profitMargin.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Collection Rate</span>
              <span className="font-medium text-blue-600">
                {reportData.totalSales > 0 ? ((reportData.totalPaid / reportData.totalSales) * 100).toFixed(1) : '0'}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Period Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            Showing {period} report for {new Date().toLocaleDateString('en-NG', { 
              weekday: period === 'daily' ? 'long' : undefined,
              year: 'numeric', 
              month: 'long', 
              day: period !== 'monthly' ? 'numeric' : undefined 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Reports;