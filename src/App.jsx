// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import LoginPage from './pages/admin/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventsManagement from './pages/admin/EventsManagement';
import EventForm from './pages/admin/EventForm';
import SettingsPage from './pages/admin/SettingsPage';
import ContentManagement from './pages/admin/ContentManagement';
import ContentForm from './pages/admin/ContentForm';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="pt-24 flex justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

// Public layout component
const PublicLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            } />
            <Route path="/events" element={
              <PublicLayout>
                <EventsPage />
              </PublicLayout>
            } />

            {/* Public content routes - Temporarily commented out until components are created 
            <Route path="/news" element={
              <PublicLayout>
                <NewsPage />
              </PublicLayout>
            } />
            <Route path="/news/:id" element={
              <PublicLayout>
                <NewsDetailPage />
              </PublicLayout>
            } />
            <Route path="/publications" element={
              <PublicLayout>
                <PublicationsPage />
              </PublicLayout>
            } />
            <Route path="/publications/:id" element={
              <PublicLayout>
                <PublicationDetailPage />
              </PublicLayout>
            } />
            <Route path="/resources" element={
              <PublicLayout>
                <ResourcesPage />
              </PublicLayout>
            } />
            <Route path="/blog" element={
              <PublicLayout>
                <BlogPage />
              </PublicLayout>
            } />
            <Route path="/blog/:id" element={
              <PublicLayout>
                <BlogDetailPage />
              </PublicLayout>
            } />
            
            
            {/* Admin login (without admin header) */}
            <Route path="/admin/login" element={<LoginPage />} />
            
            {/* Admin routes with AdminLayout */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute>
                <AdminLayout>
                  <EventsManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/events/new" element={
              <ProtectedRoute>
                <AdminLayout>
                  <EventForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/events/edit/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <EventForm />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* Settings route */}
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <AdminLayout>
                  <SettingsPage />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* Content management routes */}
            <Route path="/admin/content/:type" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ContentManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/content/:type/new" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ContentForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/content/:type/edit/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ContentForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            
            {/* 404 route */}
            <Route path="*" element={
              <PublicLayout>
                <div className="pt-24 text-center text-xl">Page not found</div>
              </PublicLayout>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;