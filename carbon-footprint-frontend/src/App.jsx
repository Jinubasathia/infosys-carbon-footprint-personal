import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import UserLoginPage from './pages/UserLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminShell from './components/AdminShell';
import UserShell from './components/UserShell';
import AdminActivityLogsPage from './pages/AdminActivityLogsPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import ActivityTypeManagementPage from './pages/ActivityTypeManagementPage';
import EmissionFactorManagementPage from './pages/EmissionFactorManagementPage';
import ActivityLoggingPage from './pages/ActivityLoggingPage';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/reset-password"
        element={
          <ProtectedRoute>
            <ResetPasswordPage />
          </ProtectedRoute>
        }
      />

      <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminShell /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminDashboard />} />
        <Route path="categories" element={<CategoryManagementPage />} />
        <Route path="activity-types" element={<ActivityTypeManagementPage />} />
        <Route path="emission-factors" element={<EmissionFactorManagementPage />} />
        <Route path="activity-logs" element={<AdminActivityLogsPage />} />
      </Route>

      <Route path="/user" element={<ProtectedRoute><UserShell /></ProtectedRoute>}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="activities" element={<ActivityLoggingPage />} />
        <Route path="history" element={<ActivityLoggingPage />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
