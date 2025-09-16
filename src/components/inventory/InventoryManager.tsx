import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useProducts } from '../../hooks/useSupabaseData';

const InventoryManager = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    cost_price: '',
    selling_price: '',
    low_stock_alert: '5'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      quantity: '',
      cost_price: '',
      selling_price: '',
      low_stock_alert: '5'
    });
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }

    if (parseFloat(formData.selling_price) <= parseFloat(formData.cost_price)) {
      if (!confirm('Selling price is not higher than cost price. This will result in no profit or loss. Continue?')) {
        return;
      }
    }

    const productData = {
      name: formData.name,
      quantity: parseInt(formData.quantity),
      cost_price: parseFloat(formData.cost_price),
      selling_price: parseFloat(formData.selling_price),
      low_stock_alert: parseInt(formData.low_stock_alert)
    };

    if (editingProduct) {
      // Update existing product
      await updateProduct(editingProduct.id, productData);
    } else {
      // Add new product
      await addProduct(productData);
    }

    resetForm();
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      quantity: product.quantity.toString(),
      cost_price: product.cost_price.toString(),
      selling_price: product.selling_price.toString(),
      low_stock_alert: product.low_stock_alert.toString()
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
    }
  };

  const lowStockProducts = products.filter(product => product.quantity <= product.low_stock_alert);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h3 className="font-medium text-orange-800">Low Stock Alert</h3>
          </div>
          <p className="text-sm text-orange-700">
            {lowStockProducts.length} product(s) are running low: {lowStockProducts.map(p => p.name).join(', ')}
          </p>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Price (₦)
              </label>
              <input
                type="number"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price (₦)
              </label>
              <input
                type="number"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Stock Alert
              </label>
              <input
                type="number"
                value={formData.low_stock_alert}
                onChange={(e) => setFormData({ ...formData, low_stock_alert: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No products in inventory</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Selling Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit Margin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => {
                  const profitMargin = ((product.selling_price - product.cost_price) / product.cost_price * 100).toFixed(1);
                  const isLowStock = product.quantity <= product.low_stock_alert;
                  
                  return (
                    <tr key={product.id} className={isLowStock ? 'bg-orange-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            {isLowStock && (
                              <div className="text-xs text-orange-600 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Low Stock
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${isLowStock ? 'text-orange-600 font-medium' : 'text-gray-900'}`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₦{product.cost_price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₦{product.selling_price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {profitMargin}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManager;