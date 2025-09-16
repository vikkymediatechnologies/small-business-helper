import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          phone: string;
          business_name: string;
          is_pro: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          phone: string;
          business_name: string;
          is_pro?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          business_name?: string;
          is_pro?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          quantity: number;
          cost_price: number;
          selling_price: number;
          low_stock_alert: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          quantity: number;
          cost_price: number;
          selling_price: number;
          low_stock_alert?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          quantity?: number;
          cost_price?: number;
          selling_price?: number;
          low_stock_alert?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          total_amount: number;
          customer_name: string | null;
          customer_phone: string | null;
          is_paid: boolean;
          is_debt: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          total_amount: number;
          customer_name?: string | null;
          customer_phone?: string | null;
          is_paid?: boolean;
          is_debt?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          product_name?: string;
          quantity?: number;
          unit_price?: number;
          total_amount?: number;
          customer_name?: string | null;
          customer_phone?: string | null;
          is_paid?: boolean;
          is_debt?: boolean;
          created_at?: string;
        };
      };
      debts: {
        Row: {
          id: string;
          user_id: string;
          customer_name: string;
          customer_phone: string;
          amount: number;
          description: string;
          is_paid: boolean;
          created_at: string;
          paid_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          customer_name: string;
          customer_phone: string;
          amount: number;
          description: string;
          is_paid?: boolean;
          created_at?: string;
          paid_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          customer_name?: string;
          customer_phone?: string;
          amount?: number;
          description?: string;
          is_paid?: boolean;
          created_at?: string;
          paid_at?: string | null;
        };
      };
    };
  };
}