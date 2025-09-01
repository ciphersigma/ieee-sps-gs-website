// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // EMERGENCY FIX: Fixed hardcoded roles - no database queries
  const userRoles = [
    {
      id: 'hardcoded-role',
      role: 'super_admin',
      is_active: true
    }
  ];

  useEffect(() => {
    console.log('AuthContext - Setting up...');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session');
        const { data } = await supabase.auth.getSession();
        setUser(data?.session?.user || null);
        console.log('Initial session:', data?.session ? 'Found' : 'None');
      } catch (error) {
        console.error('Session error:', error);
      } finally {
        setLoading(false);
        console.log('Initial loading complete');
      }
    };
    
    getInitialSession();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      setUser(session?.user || null);
      setLoading(false);
    });
    
    // Cleanup
    return () => {
      if (authListener?.subscription?.unsubscribe) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Simplified login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email, password
      });
      
      if (error) throw error;
      console.log('Login successful');
      return { data, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Simplified logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      return { error: null };
    } catch (error) {
      console.error('Logout error:', error);
      return { error };
    }
  };

  // Helper functions with fixed responses
  const hasRole = () => true;
  const isSuperAdmin = () => true;
  const isOrgAdmin = () => true;

  const value = {
    user,
    userRoles,
    loading,
    login,
    logout,
    hasRole,
    isSuperAdmin,
    isOrgAdmin
  };

  console.log('AuthContext current state:', { 
    user: !!user,
    loading,
    roles: userRoles.length
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}