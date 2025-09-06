import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Import your page components
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccount.jsx';
import DashboardPage from './pages/Dashboard.jsx'; 
import CreateTaskPage from './pages/CreateTaskPage.jsx';
import ProjectDetailPage from './pages/ProductPage.jsx';
import UserProfilePage from './pages/UserProfile.jsx'; // New import

// A wrapper for protected routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// A wrapper for public routes (login/register) for authenticated users
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
    
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

// Component to handle all application routes
const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><CreateAccountPage /></PublicRoute>} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/project/:projectId" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
            <Route path="/project/:projectId/new-task" element={<ProtectedRoute><CreateTaskPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* Fallback for any other route */}
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    )
}

function App() {
  return (
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
  );
}

export default App;