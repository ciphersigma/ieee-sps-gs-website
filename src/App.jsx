// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage'; // NEW: Import EventDetailPage
import AboutPage from './pages/AboutPage';
import ResearchPage from './pages/ResearchPage';
import CommitteePage from './pages/CommitteePage';
import LoginPage from './pages/admin/LoginPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage'; 
import StudentRepresentativesPage from "./pages/StudentRepresentativesPage";

// Import AdminRoutes component
import AdminRoutes from './routes/AdminRoutes';
import PlaceholderPage from './components/common/PlaceholderPage';

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
  console.log("App component rendering");
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
            
            {/* NEW: Event Detail Page Route */}
            <Route path="/events/:id" element={
              <MainLayout>
                <EventDetailPage />
              </MainLayout>
            } />
            
            {/* About Us route */}
            <Route path="/about" element={
              <MainLayout>
                <AboutPage />
              </MainLayout>
            } />
            
            {/* Research route */}
            <Route path="/research" element={
              <MainLayout>
                <ResearchPage />
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
            <Route path="/committee/past" element={<MainLayout><PlaceholderPage title="Past Committee" /></MainLayout>} />
            <Route path="/committee/former-chair" element={<MainLayout><PlaceholderPage title="Former Chair" /></MainLayout>} />
            
            {/* Routes for additional sections in the navigation bar */}
            <Route path="/opportunities/*" element={<MainLayout><PlaceholderPage title="Opportunities" /></MainLayout>} />
            <Route path="/student/*" element={<MainLayout><PlaceholderPage title="Student Corner" /></MainLayout>} />
            <Route path="/awards" element={<MainLayout><PlaceholderPage title="Awards" /></MainLayout>} />
            <Route path="/newsletter" element={<MainLayout><PlaceholderPage title="Newsletter" /></MainLayout>} />
            <Route path="/gallery" element={<MainLayout><PlaceholderPage title="Photo Gallery" /></MainLayout>} />
            <Route path="/join" element={<MainLayout><PlaceholderPage title="Join IEEE SPS Gujarat" description="Membership information coming soon..." /></MainLayout>} />
            {/* Contact Page route */}
            <Route path="/contact" element={
              <MainLayout>
                <ContactPage />
              </MainLayout>
            } />
            
            {/* Admin login (without admin header) */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Admin routes using AdminRoutes component */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminRoutes />
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