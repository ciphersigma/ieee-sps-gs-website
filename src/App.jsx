// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import AboutPage from './pages/AboutPage';
import CommitteePage from './pages/CommitteePage';
import LoginPage from './pages/admin/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventsManagement from './pages/admin/EventsManagement';
import EventForm from './pages/admin/EventForm';
import SettingsPage from './pages/admin/SettingsPage';
import ContentManagement from './pages/admin/ContentManagement';
import ContentForm from './pages/admin/ContentForm';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage'; 
import StudentRepresentativesPage from "./pages/StudentRepresentativesPage";
import CarouselManager from './pages/admin/CarouselManager'; // Import the new component

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

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public routes with MainLayout */}
            <Route path="/" element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            } />
            <Route path="/events" element={
              <MainLayout>
                <EventsPage />
              </MainLayout>
            } />
            
            {/* About Us route */}
            <Route path="/about" element={
              <MainLayout>
                <AboutPage />
              </MainLayout>
            } />
            
            {/* About Us sub-routes */}
            <Route path="/about/mission" element={
              <MainLayout>
                <AboutPage />
              </MainLayout>
            } />
            <Route path="/about/history" element={
              <MainLayout>
                <AboutPage />
              </MainLayout>
            } />
            <Route path="/about/focus-areas" element={
              <MainLayout>
                <AboutPage />
              </MainLayout>
            } />

            {/* Committee routes */}
            <Route path="/committee" element={
              <MainLayout>
                <CommitteePage />
              </MainLayout>
            } />
            <Route path="/committee/SCR-Team" element={
              <MainLayout>
                <StudentRepresentativesPage />
              </MainLayout>
            } />
            <Route path="/committee/executive" element={
              <MainLayout>
                <CommitteePage />
              </MainLayout>
            } />
            <Route path="/committee/past" element={
              <MainLayout>
                <div className="container mx-auto py-12 px-4">
                  <h1 className="text-3xl font-bold mb-8">Past Committee</h1>
                  <p>Content coming soon...</p>
                </div>
              </MainLayout>
            } />
            <Route path="/committee/former-chair" element={
              <MainLayout>
                <div className="container mx-auto py-12 px-4">
                  <h1 className="text-3xl font-bold mb-8">Former Chair</h1>
                  <p>Content coming soon...</p>
                </div>
              </MainLayout>
            } />


            {/* Routes for additional sections in the navigation bar */}
            <Route path="/opportunities/*" element={
              <MainLayout>
                <div className="container mx-auto py-12 px-4">
                  <h1 className="text-3xl font-bold mb-8">Opportunities</h1>
                  <p>Content coming soon...</p>
                </div>
              </MainLayout>
            } />
            <Route path="/student/*" element={
              <MainLayout>
                <div className="container mx-auto py-12 px-4">
                  <h1 className="text-3xl font-bold mb-8">Student Corner</h1>
                  <p>Content coming soon...</p>
                </div>
              </MainLayout>
            } />
            <Route path="/awards" element={
              <MainLayout>
                <div className="container mx-auto py-12 px-4">
                  <h1 className="text-3xl font-bold mb-8">Awards</h1>
                  <p>Content coming soon...</p>
                </div>
              </MainLayout>
            } />
            <Route path="/newsletter" element={
              <MainLayout>
                <div className="container mx-auto py-12 px-4">
                  <h1 className="text-3xl font-bold mb-8">Newsletter</h1>
                  <p>Content coming soon...</p>
                </div>
              </MainLayout>
            } />
            <Route path="/gallery" element={
              <MainLayout>
                <div className="container mx-auto py-12 px-4">
                  <h1 className="text-3xl font-bold mb-8">Photo Gallery</h1>
                  <p>Content coming soon...</p>
                </div>
              </MainLayout>
            } />
            <Route path="/join" element={
              <MainLayout>
                <div className="container mx-auto py-12 px-4">
                  <h1 className="text-3xl font-bold mb-8">Join IEEE SPS Gujarat</h1>
                  <p>Membership information coming soon...</p>
                </div>
              </MainLayout>
            } />
            {/* Contact Page route */}
            <Route path="/contact" element={
              <MainLayout>
                <ContactPage />
              </MainLayout>
            } />
            {/* Public content routes - Temporarily commented out until components are created 
            <Route path="/news" element={
              <MainLayout>
                <NewsPage />
              </MainLayout>
            } />
            <Route path="/news/:id" element={
              <MainLayout>
                <NewsDetailPage />
              </MainLayout>
            } />
            <Route path="/publications" element={
              <MainLayout>
                <PublicationsPage />
              </MainLayout>
            } />
            <Route path="/publications/:id" element={
              <MainLayout>
                <PublicationDetailPage />
              </MainLayout>
            } />
            <Route path="/resources" element={
              <MainLayout>
                <ResourcesPage />
              </MainLayout>
            } />
            <Route path="/blog" element={
              <MainLayout>
                <BlogPage />
              </MainLayout>
            } />
            <Route path="/blog/:id" element={
              <MainLayout>
                <BlogDetailPage />
              </MainLayout>
            } />
            */}
            
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

            {/* Carousel management route */}
            <Route path="/admin/carousel" element={
              <ProtectedRoute>
                <AdminLayout>
                  <CarouselManager />
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
            
            {/* 404 route - Using NotFoundPage component instead of inline JSX */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;