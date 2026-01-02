import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import your pages
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import DashboardLayout from './DashboardLayout';
import Tasks from './pages/Tasks';
import Goals from './pages/Goals';
import Reminders from './pages/Reminders';
import Habits from './pages/Habits';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* Dashboard Layout (Parent) */}
        <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Navigate to="tasks" replace />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="goals" element={<Goals />} />
                <Route path="reminders" element={<Reminders />} />
                <Route path="habits" element={<Habits />} />
            </Route>
            <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback: Redirect unknown URLs to login */}
        <Route path="*" element={<Navigate to="/dashboard/tasks" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;