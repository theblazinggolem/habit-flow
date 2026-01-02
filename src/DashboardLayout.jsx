    import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  const styles = {
    container: {
      display: 'grid',
      // Here is our specific column rule:
      gridTemplateColumns: '1fr 300px', 
      height: '100vh', 
    },
    mainContent: {
      padding: '20px',
      overflowY: 'auto', // Allows scrolling if content is long
    },
    sidebar: {
      backgroundColor: '#f4f4f4', // Just to visualize the split
      padding: '20px',
      borderLeft: '1px solid #ddd',
    }
  };

  return (
    <div style={styles.container}>
    
      <main style={styles.mainContent}>
        <Outlet />
      </main>

      <aside style={styles.sidebar}>
        <h2>Sidebar</h2>
        <p>Calendar & Upcoming go here</p>
      </aside>

    </div>
  );
};

export default DashboardLayout;