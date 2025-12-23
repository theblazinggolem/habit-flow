import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import DashboardLayout from "./DashboardLayout";

import Tasks from "./pages/modules/Tasks";
import Goals from "./pages/modules/Goals";
import Reminders from "./pages/modules/Reminders";
import Habits from "./pages/modules/Habits";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function App() {
    return (
        <Routes>
            {/* --- PUBLIC ROUTES (No Sidebar) --- */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* --- PROTECTED / APP ROUTES (With Sidebar) --- */}
            {/* Any route inside here will have the DashboardLayout */}
            <Route element={<DashboardLayout />}>
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/habits" element={<Habits />} />
                <Route path="/settings" element={<Settings />} />
            </Route>

            {/* --- FALLBACK --- */}
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            {/* Catch-all for 404s */}
            <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Routes>
    );
}

export default App;
