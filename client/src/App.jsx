import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthCard from './components/AuthCard';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthCard />} />
        <Route path="/register" element={<AuthCard />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/dashboard/tasks" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
