import { NavLink } from "react-router-dom";

const NavBar = () => {
  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    fontWeight: "bold",
    color: isActive ? "#4f46e5" : "#6b7280", // Purple if active, gray if not
    paddingBottom: isActive ? "2px" : "0",
    borderBottom: isActive ? "2px solid #4f46e5" : "none"
  });

  return (
    <nav style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 30px", gap: "30px" }}>
      <h2 style={{ marginRight: "auto", margin: 0, fontSize: "20px", color: "#111" }}>HabitFlow</h2>
      
      <NavLink to="/tasks" style={linkStyle}>Tasks</NavLink>
      <NavLink to="/goals" style={linkStyle}>Goals</NavLink>
      <NavLink to="/reminders" style={linkStyle}>Reminders</NavLink>
      <NavLink to="/habits" style={linkStyle}>Habits</NavLink>
      
      <NavLink to="/settings" style={{ ...linkStyle({isActive: false}), marginLeft: "20px" }}>Settings</NavLink>
    </nav>
  );
};

export default NavBar;