import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import DatePicker from "./components/DatePicker";
import UpcomingTab from "./components/UpcomingTab";

const DashboardLayout = () => {
  return (
    // 1. OUTER CONTAINER (Dark Background, Centered)
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: "100vh", width: "100vw", backgroundColor: "#1a1a1a"
    }}>
      
      {/* 2. APP BOX (The White Dashboard Card) */}
      <div style={{
        display: "flex", width: "1200px", height: "800px",
        backgroundColor: "white", borderRadius: "12px", overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
      }}>

        {/* === LEFT COLUMN: Content (75% Width) === */}
        <div style={{ flex: "3", display: "flex", flexDirection: "column", borderRight: "2px solid #eee" }}>
          
          {/* ROW A: Top Navigation (Blue in diagram) */}
          <div style={{ height: "70px", borderBottom: "1px solid #eee" }}>
            <NavBar />
          </div>

          {/* ROW B: Main Table Area (White in diagram - Expands) */}
          <main style={{ flex: "1", overflowY: "auto", padding: "20px" }}>
            <Outlet />
          </main>

          {/* ROW C: Input Area (Bottom Fixed) */}
          <div style={{ height: "80px", borderTop: "1px solid #eee", padding: "20px", display: "flex", alignItems: "center", backgroundColor: "#f9fafb" }}>
            <input 
              type="text" 
              placeholder="Add item..." 
              style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ddd", marginRight: "10px" }}
            />
            <button style={{ padding: "10px 20px", backgroundColor: "black", color: "white", borderRadius: "6px", border: "none", cursor: "pointer" }}>
              Add
            </button>
          </div>

        </div>

        {/* === RIGHT COLUMN: Widgets (25% Width) === */}
        <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
          
          {/* WIDGET 1: Date Picker (Red in diagram) */}
          <div style={{ height: "40%", borderBottom: "1px solid #eee", padding: "20px" }}>
            <DatePicker />
          </div>

          {/* WIDGET 2: Upcoming Tab (Green in diagram) */}
          <div style={{ flex: "1", padding: "20px", backgroundColor: "#f9fafb" }}>
            <UpcomingTab />
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;