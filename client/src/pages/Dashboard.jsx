import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Calendar from '../components/Calendar';
import Upcoming from '../components/Upcoming';
import Tasks from '../components/Tasks';
import Goals from '../components/Goals';
import Reminders from '../components/Reminders';
import Habits from '../components/Habits';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active tab from URL
    const activeTab = location.pathname.split('/').pop();

    const tabs = ['tasks', 'goals', 'reminders', 'habits'];

    const handleTabClick = (tab) => {
        navigate(`/dashboard/${tab}`);
    };

    const [showLogout, setShowLogout] = useState(false);

    const handleLogout = (e) => {
        e.stopPropagation();
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            {/* Left Panel */}
            <div className="left-panel">
                {/* Navigation Tabs */}
                <div className="nav-tabs">
                    {tabs.map(tab => (
                        <div
                            key={tab}
                            className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="content-area">
                    <Routes>
                        <Route path="tasks" element={<Tasks />} />
                        <Route path="goals" element={<Goals />} />
                        <Route path="reminders" element={<Reminders />} />
                        <Route path="habits" element={<Habits />} />
                        <Route path="/" element={<Navigate to="tasks" replace />} />
                    </Routes>
                </div>

                {/* Input Area - This might need to be inside the specific components if inputs differ significantly, 
                    but instructions say "bottom row is the input fields which differ based on which tab you are on".
                    So we can let the components handle their own input area or render it here via portal/state.
                    For simplicity, let's put the input area inside the components themselves at the bottom, 
                    OR render a common container here and pass props. 
                    Given the structure "split into 2 rows ... bottom is input", 
                    it implies the Input is fixed at the bottom of the Left Panel.
                    I'll implement the input area inside the specific components to keep logic co-located.
                */}
            </div>

            {/* Right Panel */}
            <div className="right-panel">
                <div className="calendar-widget">
                    <Calendar />
                </div>
                <div className="upcoming-widget">
                    <Upcoming />
                </div>
                <div className="account-widget" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowLogout(!showLogout)}>
                    <span>Account</span>
                    <span>⚙️</span>
                    {showLogout && (
                        <div style={{
                            position: 'absolute',
                            bottom: '100%',
                            right: '0',
                            backgroundColor: '#18181B',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            padding: '10px',
                            zIndex: 100,
                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                        }}>
                            <div
                                onClick={handleLogout}
                                style={{ color: '#ff4444', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                LOGOUT
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
