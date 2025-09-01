// src/routes/AdminRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import AdminLayout from '../components/layout/AdminLayout';

// Admin Pages
import SuperAdminDash from '../pages/admin/SuperAdminDash';
import EventsManagement from '../pages/admin/EventsManagement';
import EventForm from '../pages/admin/EventForm';
import SettingsPage from '../pages/admin/SettingsPage';
import ContentManagement from '../pages/admin/ContentManagement';
import ContentForm from '../pages/admin/ContentForm';
import CarouselManager from '../pages/admin/CarouselManager';

// User Management Components (new)
import UsersList from '../pages/admin/UsersList';
import UserAccountForm from '../pages/admin/UserAccountForm';
import OrganizationManagement from '../pages/admin/OrganizationManagement';

// Protected route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, hasRole } = useAuth();
  
  if (loading) {
    return <div className="pt-24 flex justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Check if user has required role (if specified)
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

const AdminRoutes = () => {
  const { isSuperAdmin } = useAuth();
  
  return (
    <Routes>
      {/* Dashboard */}
      <Route index element={
        <ProtectedRoute>
          <AdminLayout>
            <SuperAdminDash />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Events Management */}
      <Route path="events" element={
        <ProtectedRoute>
          <AdminLayout>
            <EventsManagement />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="events/new" element={
        <ProtectedRoute>
          <AdminLayout>
            <EventForm />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="events/edit/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <EventForm />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* User Management - Super Admin Only */}
      <Route path="users" element={
        <ProtectedRoute requiredRole="super_admin">
          <AdminLayout>
            <UsersList />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="users/new" element={
        <ProtectedRoute requiredRole="super_admin">
          <AdminLayout>
            <UserAccountForm />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Organization Management - Super Admin Only */}
      <Route path="organizations" element={
        <ProtectedRoute requiredRole="super_admin">
          <AdminLayout>
            <OrganizationManagement />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Carousel Management */}
      <Route path="carousel" element={
        <ProtectedRoute>
          <AdminLayout>
            <CarouselManager />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Settings */}
      <Route path="settings" element={
        <ProtectedRoute>
          <AdminLayout>
            <SettingsPage />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Content Management */}
      <Route path="content/:type" element={
        <ProtectedRoute>
          <AdminLayout>
            <ContentManagement />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="content/:type/new" element={
        <ProtectedRoute>
          <AdminLayout>
            <ContentForm />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="content/:type/edit/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <ContentForm />
          </AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AdminRoutes;