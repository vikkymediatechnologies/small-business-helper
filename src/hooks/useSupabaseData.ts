import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const addProduct = async (productData: any) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      setProducts(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateProduct = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
}

export function useSales() {
  const { user } = useAuth();
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [user]);

  const addSale = async (saleData: any) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('sales')
        .insert({
          ...saleData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      setSales(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  return {
    sales,
    loading,
    error,
    addSale,
    refetch: fetchSales
  };
}

export function useDebts() {
  const { user } = useAuth();
  const [debts, setDebts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDebts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDebts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, [user]);

  const addDebt = async (debtData: any) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('debts')
        .insert({
          ...debtData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      setDebts(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const markDebtPaid = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('debts')
        .update({ 
          is_paid: true, 
          paid_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setDebts(prev => prev.map(d => d.id === id ? data : d));
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  return {
    debts,
    loading,
    error,
    addDebt,
    markDebtPaid,
    refetch: fetchDebts
  };
}