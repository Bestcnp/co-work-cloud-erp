/**
 * App Root Component
 *
 * Sets up React Router and wraps everything in AuthProvider.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* Future routes will be added here:
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/showcases" element={<ShowcasesPage />} />
              <Route path="/recruitment" element={<RecruitmentPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              */}
            </Route>
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
