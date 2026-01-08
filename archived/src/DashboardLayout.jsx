import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Calendar from './components/Calendar';
import UpcomingTab from './components/UpcomingTab';

const DashboardLayout = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr 300px',
      height: '100vh',
      fontFamily: "'Inter', sans-serif"
    },
    mainContent: {
      padding: '0',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    },
    sidebar: {
      backgroundColor: '#f8f9fa',
      borderLeft: '1px solid #e9ecef',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    },
    navBar: {
      padding: '20px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      gap: '20px'
    },
    navLink: {
      textDecoration: 'none',
      color: '#495057',
      fontWeight: 500
    },
    activeNavLink: {
      color: '#007bff',
      borderBottom: '2px solid #007bff'
    }
  };

  const getNavLinkStyle = ({ isActive }) => ({
    ...styles.navLink,
    ...(isActive ? styles.activeNavLink : {})
  });

  return (
    <div style={styles.container}>

      <main style={styles.mainContent}>
        <nav style={styles.navBar}>
          <NavLink to="tasks" style={getNavLinkStyle}>Tasks</NavLink>
          <NavLink to="goals" style={getNavLinkStyle}>Goals</NavLink>
          <NavLink to="reminders" style={getNavLinkStyle}>Reminders</NavLink>
          <NavLink to="habits" style={getNavLinkStyle}>Habits</NavLink>
        </nav>
        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          <Outlet context={{ selectedDate }} />
        </div>
      </main>

      <aside style={styles.sidebar}>
        <Calendar onDateSelect={setSelectedDate} />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <UpcomingTab items={[]} />
        </div>
      </aside>

    </div>
  );
};

export default DashboardLayout;