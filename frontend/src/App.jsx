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
import ConferenceGrantPage from './pages/ConferenceGrantPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import SitemapPage from './pages/SitemapPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import StudentTravelGrantsPage from './pages/StudentTravelGrantsPage';
import AwardsPage from './pages/AwardsPage';
import NewsletterPage from './pages/NewsletterPage';
import JoinBenefitsPage from './pages/JoinBenefitsPage';
import StudentChaptersPage from './pages/StudentChaptersPage';
import ScrollToTop from './components/common/ScrollToTop';
import EasterEggs from './components/common/EasterEggs';

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
          <ScrollToTop />
          <EasterEggs />
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
            <Route path="/opportunities/conference-grant" element={
              <MainLayout>
                <ConferenceGrantPage />
              </MainLayout>
            } />
            <Route path="/opportunities/scholarships" element={
              <MainLayout>
                <ScholarshipsPage />
              </MainLayout>
            } />
            <Route path="/opportunities/student-travel-grants" element={
              <MainLayout>
                <StudentTravelGrantsPage />
              </MainLayout>
            } />
            <Route path="/opportunities/*" element={<MainLayout><PlaceholderPage title="Opportunities" /></MainLayout>} />
            <Route path="/student/chapters" element={
              <MainLayout>
                <StudentChaptersPage />
              </MainLayout>
            } />
            <Route path="/student/*" element={<MainLayout><PlaceholderPage title="Student Corner" /></MainLayout>} />
            <Route path="/awards" element={
              <MainLayout>
                <AwardsPage />
              </MainLayout>
            } />
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
            <Route path="/newsletter" element={
              <MainLayout>
                <NewsletterPage />
              </MainLayout>
            } />
            <Route path="/gallery" element={<MainLayout><PlaceholderPage title="Photo Gallery" /></MainLayout>} />
            <Route path="/join" element={
              <MainLayout>
                <JoinBenefitsPage />
              </MainLayout>
            } />
            <Route path="/sitemap" element={
              <MainLayout>
                <SitemapPage />
              </MainLayout>
            } />
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
            
            {/* Special easter egg route */}
            <Route path="/signal-processing-rocks" element={
              <MainLayout>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                  <div className="text-center text-white">
                    <h1 className="text-6xl font-bold mb-4">🎉 You Found It! 🎉</h1>
                    <p className="text-2xl mb-8">Secret IEEE SPS Gujarat Page</p>
                    <div className="text-8xl animate-bounce">📡</div>
                  </div>
                </div>
              </MainLayout>
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