import { Routes, Route, Navigate } from 'react-router-dom';
import CreateAccountPage from './pages/CreateAccount.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/Dashboard.jsx';
import ProjectPage from './pages/ProductPage.jsx'; // 👈 Import the ProjectPage component
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<CreateAccountPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      
      {/* 👇 Add the new dynamic route for a single project */}
      <Route path="/project/:projectId" element={<ProjectPage />} /> 
      
      {/* Redirect to the login page by default */}
      <Route path="/" element={<Navigate to="/login" />} /> 
    </Routes>
  );
}

export default App;