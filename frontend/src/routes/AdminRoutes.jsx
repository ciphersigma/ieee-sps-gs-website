// src/routes/AdminRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, USER_ROLES } from '../contexts/AuthContext';

// Layouts
import AdminLayout from '../components/layout/AdminLayout';

// Admin Pages
import SuperAdminDash from '../pages/admin/SuperAdminDash';
import AdminDashboard from '../pages/admin/AdminDashboard';
import EventsManagement from '../pages/admin/EventsManagement';
import EventForm from '../pages/admin/EventForm';
import SettingsPage from '../pages/admin/SettingsPage';
import ContentManagement from '../pages/admin/ContentManagement';
import ContentForm from '../pages/admin/ContentForm';
import CarouselManager from '../pages/admin/CarouselManager';
import ResearchManagement from '../pages/admin/ResearchManagement';
import ResearchForm from '../pages/admin/ResearchForm';
import DatabaseMigration from '../pages/admin/DatabaseMigration';
import MembersManagement from '../pages/admin/MembersManagement';
import MemberForm from '../pages/admin/MemberForm';
import BranchManagement from '../pages/admin/BranchManagement';
import BranchUserManagement from '../pages/admin/BranchUserManagement';
import BranchDashboard from '../pages/admin/BranchDashboard';
import ProfilePage from '../pages/admin/ProfilePage';
import AwardsManagement from '../pages/admin/AwardsManagement';
import NewsletterManagement from '../pages/admin/NewsletterManagement';

// Protected route component with enhanced role checking
const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { user, loading, hasRole, hasPermission } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Check if user has required role (if specified)
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <AdminLayout>
        <div className="py-8 text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Required role: {requiredRole}</p>
        </div>
      </AdminLayout>
    );
  }
  
  // Check if user has required permission (if specified)
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <AdminLayout>
        <div className="py-8 text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this feature.</p>
          <p className="text-sm text-gray-500 mt-2">Required permission: {requiredPermission}</p>
        </div>
      </AdminLayout>
    );
  }
  
  return children;
};

// Dashboard selector component
const DashboardSelector = () => {
  const { user, isSuperAdmin, isBranchUser } = useAuth();
  
  if (isSuperAdmin()) {
    return <SuperAdminDash />;
  } else if (isBranchUser()) {
    return <BranchDashboard />;
  } else {
    return (
      <div className="py-8 text-center">
        <h2 className="text-xl font-bold mb-4">Welcome to Admin Panel</h2>
        <p className="text-gray-600">Please contact your administrator for access.</p>
      </div>
    );
  }
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Dashboard - Role-based routing */}
      <Route index element={
        <ProtectedRoute>
          <AdminLayout>
            <DashboardSelector />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Events Management - Permission-based access */}
      <Route path="events" element={
        <ProtectedRoute requiredPermission="events">
          <AdminLayout>
            <EventsManagement />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="events/new" element={
        <ProtectedRoute requiredPermission="events">
          <AdminLayout>
            <EventForm />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="events/edit/:id" element={
        <ProtectedRoute requiredPermission="events">
          <AdminLayout>
            <EventForm />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Branch Management - Super Admin Only */}
      <Route path="branches" element={
        <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
          <AdminLayout>
            <BranchManagement />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="branches/:branchId/users" element={
        <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
          <AdminLayout>
            <BranchUserManagement />
          </AdminLayout>
        </ProtectedRoute>
      } />



      {/* Carousel Management - Super Admin Only */}
      <Route path="carousel" element={
        <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
          <AdminLayout>
            <CarouselManager />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Profile */}
      <Route path="profile" element={
        <ProtectedRoute>
          <AdminLayout>
            <ProfilePage />
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

      {/* Content Management - Permission-based access */}
      <Route path="content/:type" element={
        <ProtectedRoute requiredPermission="content">
          <AdminLayout>
            <ContentManagement />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="content/:type/new" element={
        <ProtectedRoute requiredPermission="content">
          <AdminLayout>
            <ContentForm />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="content/:type/edit/:id" element={
        <ProtectedRoute requiredPermission="content">
          <AdminLayout>
            <ContentForm />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Research Management */}
      <Route path="research" element={
        <ProtectedRoute>
          <AdminLayout>
            <ResearchManagement />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="research/:type/new" element={
        <ProtectedRoute>
          <AdminLayout>
            <ResearchForm />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="research/:type/edit/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <ResearchForm />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Awards Management - Super Admin Only */}
      <Route path="awards" element={
        <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
          <AdminLayout>
            <AwardsManagement />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Newsletter Management - Super Admin Only */}
      <Route path="newsletter" element={
        <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
          <AdminLayout>
            <NewsletterManagement />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Members Management - Permission-based access */}
      <Route path="members" element={
        <ProtectedRoute requiredPermission="members">
          <AdminLayout>
            <MembersManagement />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="members/new" element={
        <ProtectedRoute requiredPermission="members">
          <AdminLayout>
            <MemberForm />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="members/edit/:id" element={
        <ProtectedRoute requiredPermission="members">
          <AdminLayout>
            <MemberForm />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="members/:type/new" element={
        <ProtectedRoute requiredPermission="members">
          <AdminLayout>
            <MemberForm />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="members/:type/edit/:id" element={
        <ProtectedRoute requiredPermission="members">
          <AdminLayout>
            <MemberForm />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Database Migration - Super Admin Only */}
      <Route path="migration" element={
        <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
          <AdminLayout>
            <DatabaseMigration />
          </AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AdminRoutes;