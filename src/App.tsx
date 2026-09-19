import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LandingPage } from './components/LandingPage';
import { DashboardLayout } from './components/DashboardLayout';
import { AuthModal } from './components/AuthModal';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [inDashboard, setInDashboard] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleEnterDashboard = () => {
    setInDashboard(true);
  };

  const handleReturnToLanding = () => {
    setInDashboard(false);
  };

  // If the user requested to enter dashboard and is logged in, show Dashboard
  if (inDashboard && currentUser) {
    return (
      <DashboardLayout onReturnToLanding={handleReturnToLanding} />
    );
  }

  // Otherwise, show Landing Page with Auth modal accessible
  return (
    <>
      <LandingPage
        onOpenAuth={handleOpenAuth}
        onEnterDashboard={handleEnterDashboard}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
