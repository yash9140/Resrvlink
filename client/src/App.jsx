import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

import PublicLayout from './layouts/PublicLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/customer/DashboardPage';
import NewReservationPage from './pages/customer/NewReservationPage';
import MyReservationsPage from './pages/customer/MyReservationsPage';
import ProfilePage from './pages/customer/ProfilePage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ReservationManagementPage from './pages/admin/ReservationManagementPage';
import TableManagementPage from './pages/admin/TableManagementPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>

          {/* Protected Customer Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<CustomerLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/reservations/new" element={<NewReservationPage />} />
              <Route path="/reservations" element={<MyReservationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            
            {/* Admin Only Routes */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/reservations" element={<ReservationManagementPage />} />
                <Route path="/admin/tables" element={<TableManagementPage />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
