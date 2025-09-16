/*
  # Initial Schema for Small Business Helper

  1. New Tables
    - `profiles` - User business profiles
      - `id` (uuid, references auth.users)
      - `phone` (text, unique)
      - `business_name` (text)
      - `is_pro` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `products` - Inventory items
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `quantity` (integer)
      - `cost_price` (decimal)
      - `selling_price` (decimal)
      - `low_stock_alert` (integer, default 5)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `sales` - Sales transactions
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `product_id` (uuid, references products)
      - `product_name` (text)
      - `quantity` (integer)
      - `unit_price` (decimal)
      - `total_amount` (decimal)
      - `customer_name` (text, nullable)
      - `customer_phone` (text, nullable)
      - `is_paid` (boolean, default true)
      - `is_debt` (boolean, default false)
      - `created_at` (timestamp)
    
    - `debts` - Customer debt records
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `customer_name` (text)
      - `customer_phone` (text)
      - `amount` (decimal)
      - `description` (text)
      - `is_paid` (boolean, default false)
      - `created_at` (timestamp)
      - `paid_at` (timestamp, nullable)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text UNIQUE NOT NULL,
  business_name text NOT NULL,
  is_pro boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  cost_price decimal(10,2) NOT NULL DEFAULT 0,
  selling_price decimal(10,2) NOT NULL DEFAULT 0,
  low_stock_alert integer NOT NULL DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  customer_name text,
  customer_phone text,
  is_paid boolean DEFAULT true,
  is_debt boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create debts table
CREATE TABLE IF NOT EXISTS debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  amount decimal(10,2) NOT NULL,
  description text NOT NULL,
  is_paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for products
CREATE POLICY "Users can read own products"
  ON products
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for sales
CREATE POLICY "Users can read own sales"
  ON sales
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sales"
  ON sales
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sales"
  ON sales
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own sales"
  ON sales
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for debts
CREATE POLICY "Users can read own debts"
  ON debts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own debts"
  ON debts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own debts"
  ON debts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own debts"
  ON debts
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();