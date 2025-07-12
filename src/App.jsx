import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SecurityProvider } from './contexts/SecurityContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import UrlScanner from './pages/UrlScanner';
import EmailScanner from './pages/EmailScanner';
import ScanHistory from './pages/ScanHistory';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Composant pour conditionner l'affichage du header
const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin/login') || location.pathname.startsWith('/admin/register');
  
  return (
    <div className="App">
      {!isAdminPage && <Header />}
      <div className={!isAdminPage ? "pt-16" : ""}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          
          {/* Routes protégées utilisateur */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/url-scanner" element={
            <PrivateRoute>
              <UrlScanner />
            </PrivateRoute>
          } />
          <Route path="/email-scanner" element={
            <PrivateRoute>
              <EmailScanner />
            </PrivateRoute>
          } />
          <Route path="/scan-history" element={
            <PrivateRoute>
              <ScanHistory />
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />

          {/* Routes protégées admin */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <SecurityProvider>
          <AppContent />
        </SecurityProvider>
      </AuthProvider>
    </Router>
  );
};

export default App; 