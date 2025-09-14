import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (phone: string, pin: string) => Promise<boolean>;
  register: (phone: string, pin: string, businessName: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('sbh_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, pin: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('sbh_users') || '[]');
      const existingUser = users.find((u: any) => u.phone === phone && u.pin === pin);
      
      if (existingUser) {
        const userData: User = {
          id: existingUser.id,
          phone: existingUser.phone,
          businessName: existingUser.businessName,
          isPro: existingUser.isPro || false,
          createdAt: new Date(existingUser.createdAt)
        };
        setUser(userData);
        localStorage.setItem('sbh_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (phone: string, pin: string, businessName: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem('sbh_users') || '[]');
      const existingUser = users.find((u: any) => u.phone === phone);
      
      if (existingUser) {
        return false; // User already exists
      }
      
      const newUser = {
        id: Date.now().toString(),
        phone,
        pin,
        businessName,
        isPro: false,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('sbh_users', JSON.stringify(users));
      
      const userData: User = {
        id: newUser.id,
        phone: newUser.phone,
        businessName: newUser.businessName,
        isPro: newUser.isPro,
        createdAt: new Date(newUser.createdAt)
      };
      
      setUser(userData);
      localStorage.setItem('sbh_user', JSON.stringify(userData));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sbh_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};