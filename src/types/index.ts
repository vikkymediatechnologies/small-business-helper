export interface User {
  id: string;
  phone: string;
  businessName: string;
  isPro: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  lowStockAlert: number;
  createdAt: Date;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  customerName?: string;
  customerPhone?: string;
  isPaid: boolean;
  isDebt: boolean;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalDebt: number;
  lastPurchase: Date;
}

export interface Debt {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  description: string;
  isPaid: boolean;
  createdAt: Date;
  paidAt?: Date;
}

export interface Report {
  totalSales: number;
  totalProfit: number;
  totalDebts: number;
  salesCount: number;
  period: 'daily' | 'weekly' | 'monthly';
  date: Date;
}