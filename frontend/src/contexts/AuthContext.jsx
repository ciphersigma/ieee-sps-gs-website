// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authAPI';

// User roles enum
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  BRANCH_ADMIN: 'branch_admin',
  CHAIRPERSON: 'chairperson',
  COUNSELLOR: 'counsellor',
  MEMBER: 'member',
  EDITOR: 'editor'
};

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('ieee_admin_token');
      if (token) {
        try {
          const result = await authService.getCurrentUser();
          if (result.data) {
            setUser(result.data);
          } else {
            localStorage.removeItem('ieee_admin_token');
            localStorage.removeItem('ieee_admin_user');
          }
        } catch (error) {
          localStorage.removeItem('ieee_admin_token');
          localStorage.removeItem('ieee_admin_user');
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    try {
      console.log('AuthContext: Starting login for', email);
      const result = await authService.login(email, password);
      console.log('AuthContext: Login result', result);
      
      if (result.data) {
        console.log('AuthContext: Setting user', result.data.user);
        setUser(result.data.user);
        return { data: result.data, error: null };
      } else {
        console.log('AuthContext: Login failed', result.error);
        return { data: null, error: result.error };
      }
    } catch (error) {
      console.error('AuthContext: Login error', error);
      return { data: null, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    return { error: null };
  };

  const hasRole = (role) => {
    if (!user) return false;
    if (user.role === USER_ROLES.SUPER_ADMIN) return true;
    return user.role === role;
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === USER_ROLES.SUPER_ADMIN) return true;
    
    // Default permissions for all admin functions
    const defaultPermissions = {
      'events': ['branch_admin', 'chairperson', 'counsellor', 'member'],
      'members': ['branch_admin', 'chairperson', 'counsellor'],
      'content': ['branch_admin', 'chairperson', 'counsellor', 'editor'],
      'settings': ['branch_admin', 'chairperson'],
      'profile': ['branch_admin', 'chairperson', 'counsellor', 'member', 'editor'],
      'awards': ['branch_admin', 'chairperson'],
      'research': ['branch_admin', 'chairperson'],
      'newsletter': ['branch_admin', 'chairperson', 'editor'],
      'carousel': ['branch_admin'],
      'branches': ['super_admin'],
      'admins': ['super_admin'],
      'migration': ['super_admin']
    };
    
    // Check if user role has default permission
    if (defaultPermissions[permission]?.includes(user.role)) {
      return true;
    }
    
    // Check explicit permissions
    return user.permissions?.includes(permission) || user.permissions?.includes('all');
  };

  const isSuperAdmin = () => {
    return user?.role === USER_ROLES.SUPER_ADMIN;
  };

  const isBranchAdmin = () => {
    return user?.role === USER_ROLES.BRANCH_ADMIN;
  };

  const isChairperson = () => {
    return user?.role === USER_ROLES.CHAIRPERSON;
  };

  const isCounsellor = () => {
    return user?.role === USER_ROLES.COUNSELLOR;
  };

  const isBranchUser = () => {
    return ['branch_admin', 'chairperson', 'counsellor', 'member'].includes(user?.role);
  };

  const getRoleDisplay = () => {
    const roleMap = {
      'super_admin': 'Super Admin',
      'branch_admin': 'Branch Admin',
      'chairperson': 'Chairperson',
      'counsellor': 'Counsellor',
      'member': 'Member',
      'editor': 'Editor'
    };
    return roleMap[user?.role] || user?.role;
  };

  const getUserBranch = () => {
    return user?.branch_id || null;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    hasPermission,
    isSuperAdmin,
    isBranchAdmin,
    isChairperson,
    isCounsellor,
    isBranchUser,
    getRoleDisplay,
    getUserBranch,
    USER_ROLES
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}