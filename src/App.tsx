import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './styles/globals.css';
import { Header } from './components/layout/Header';
import { LandingPage } from './pages/LandingPage';
import { ClaimCreationPage } from './pages/ClaimCreationPage';
import { ClaimDetailsPage } from './pages/ClaimDetailsPage';
import { PendingApprovalsPage } from './pages/PendingApprovalsPage';
import { AdminPage } from './pages/AdminPage';
import { DeclarationPage } from './pages/DeclarationPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/claims/new" element={<ClaimCreationPage />} />
            <Route path="/claims/edit/:id" element={<ClaimCreationPage />} />
            <Route path="/claims/:id" element={<ClaimDetailsPage />} />
            <Route path="/approvals" element={<PendingApprovalsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/declaration/:claimId" element={<DeclarationPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}
