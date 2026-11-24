import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { AgentsPage } from './pages/AgentsPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { TelephonyPage } from './pages/TelephonyPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { PlansPage } from './pages/PlansPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Protected layout wrapper for dashboard pages
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

// Admin route guard
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isDashboardView = [
    '/dashboard',
    '/agents',
    '/playground',
    '/telephony',
    '/campaigns',
    '/knowledge',
    '/admin'
  ].some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-brand-500/30 selection:text-brand-200">
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* Public Marketing & Auth Views */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/plans" element={
            <div className="p-4 sm:p-6 lg:p-8">
              <PlansPage />
            </div>
          } />

          {/* Console / Dashboard Views */}
          <Route path="/dashboard" element={
            <DashboardLayout>
              <DashboardOverview />
            </DashboardLayout>
          } />

          <Route path="/agents" element={
            <DashboardLayout>
              <AgentsPage />
            </DashboardLayout>
          } />

          <Route path="/playground" element={
            <DashboardLayout>
              <PlaygroundPage />
            </DashboardLayout>
          } />

          <Route path="/telephony" element={
            <DashboardLayout>
              <TelephonyPage />
            </DashboardLayout>
          } />

          <Route path="/campaigns" element={
            <DashboardLayout>
              <CampaignsPage />
            </DashboardLayout>
          } />

          <Route path="/knowledge" element={
            <DashboardLayout>
              <KnowledgeBasePage />
            </DashboardLayout>
          } />

          {/* Superuser Admin Portal */}
          <Route path="/admin" element={
            <AdminRoute>
              <DashboardLayout>
                <AdminDashboardPage />
              </DashboardLayout>
            </AdminRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Global Minimal Footer */}
      {!isDashboardView && (
        <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
          <p>© 2026 SarvamVoice AI Telephony Platform. Built for Enterprise Indic Speech Scale.</p>
        </footer>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
