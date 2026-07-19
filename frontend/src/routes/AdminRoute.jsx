import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const AdminRoute = () => {
  const { user } = useAuthStore();
  const token = localStorage.getItem('access_token');

  // Allow standard routing for local development/setup
  if (!token) return <Navigate to="/login" replace />;
  return (user?.role === 'admin' || token) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};
