import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Reports from './pages/Reports';
import IssueDetails from './pages/IssueDetails';
import CreateReport from './pages/CreateReport';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import EditUser from './pages/EditUser';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
                <Route path="/reports/new" element={<PrivateRoute><CreateReport /></PrivateRoute>} />
                <Route path="/reports/:id" element={<PrivateRoute><IssueDetails /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute requiredRole="employee"><Dashboard /></PrivateRoute>} />
                <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
                <Route path="/admin/users/:id" element={<PrivateRoute requiredRole="admin"><EditUser /></PrivateRoute>} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}