import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, User, Phone } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Product, Sale } from '../../types';

const SalesForm = () => {
  const [products, setProducts] = useLocalStorage<Product[]>('sbh_products', []);
  const [sales, setSales] = useLocalStorage<Sale[]>('sbh_sales', []);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isPaid, setIsPaid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedProduct) {
      setError('Please select a product');
      return;
    }

    if (quantity > selectedProduct.quantity) {
      setError('Not enough stock available');
      return;
    }

    if (!isPaid && (!customerName || !customerPhone)) {
      setError('Customer name and phone required for debt sales');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create sale record
      const newSale: Sale = {
        id: Date.now().toString(),
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity,
        unitPrice: selectedProduct.sellingPrice,
        totalAmount: quantity * selectedProduct.sellingPrice,
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        isPaid,
        isDebt: !isPaid,
        createdAt: new Date()
      };

      // Update product quantity
      const updatedProducts = products.map(product => 
        product.id === selectedProduct.id 
          ? { ...product, quantity: product.quantity - quantity }
          : product
      );

      // Save updates
      setSales([...sales, newSale]);
      setProducts(updatedProducts);

      // If it's a debt, also save to debts
      if (!isPaid) {
        const debts = JSON.parse(localStorage.getItem('sbh_debts') || '[]');
        const newDebt = {
          id: Date.now().toString(),
          customerId: `${customerPhone}_${Date.now()}`,
          customerName,
          customerPhone,
          amount: newSale.totalAmount,
          description: `${quantity}x ${selectedProduct.name}`,
          isPaid: false,
          createdAt: new Date()
        };
        localStorage.setItem('sbh_debts', JSON.stringify([...debts, newDebt]));
      }

      setSuccess(`Sale recorded successfully! ₦${newSale.totalAmount.toLocaleString()}`);
      
      // Reset form
      setSelectedProduct(null);
      setQuantity(1);
      setCustomerName('');
      setCustomerPhone('');
      setIsPaid(true);

    } catch (err) {
      setError('Failed to record sale. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = selectedProduct ? quantity * selectedProduct.sellingPrice : 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-500 p-2 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Record Sale</h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No products available</p>
            <p className="text-sm text-gray-400">Add products to your inventory first</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Product
              </label>
              <select
                value={selectedProduct?.id || ''}
                onChange={(e) => {
                  const product = products.find(p => p.id === e.target.value);
                  setSelectedProduct(product || null);
                  setQuantity(1);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Choose a product...</option>
                {products.filter(p => p.quantity > 0).map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ₦{product.sellingPrice.toLocaleString()} (Stock: {product.quantity})
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <>
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(selectedProduct.quantity, parseInt(e.target.value) || 1)))}
                      min="1"
                      max={selectedProduct.quantity}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(selectedProduct.quantity, quantity + 1))}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-gray-500">
                      Available: {selectedProduct.quantity}
                    </span>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-800 font-medium">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-900">
                      ₦{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Status
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={isPaid}
                        onChange={() => setIsPaid(true)}
                        className="mr-2"
                      />
                      <span className="text-green-600 font-medium">Paid</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!isPaid}
                        onChange={() => setIsPaid(false)}
                        className="mr-2"
                      />
                      <span className="text-orange-600 font-medium">Debt</span>
                    </label>
                  </div>
                </div>

                {/* Customer Details (for debt) */}
                {!isPaid && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-4">
                    <h3 className="font-medium text-orange-800 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer Details
                    </h3>
                    <div>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Customer Name"
                        className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Customer Phone"
                        className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-600 text-sm">{success}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Recording Sale...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      Record Sale
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default SalesForm;