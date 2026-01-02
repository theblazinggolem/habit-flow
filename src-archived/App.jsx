import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

// Import your existing pages
import Tasks from "./pages/modules/Tasks";
import Goals from "./pages/modules/Goals";
import Reminders from "./pages/modules/Reminders";
import Habits from "./pages/modules/Habits";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
// import Settings from "./pages/modules/Settings"; // Uncomment if you created Settings.jsx

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* The Dashboard Layout wraps these routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/habits" element={<Habits />} />
        {/* <Route path="/settings" element={<Settings />} /> */}
      </Route>

      <Route path="/" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
}

export default App;