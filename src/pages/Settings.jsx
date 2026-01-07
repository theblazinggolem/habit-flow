import React from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => navigate(-1)} style={{ marginRight: '10px', padding: '5px 10px' }}>&larr; Back</button>
                <h2>Settings</h2>
            </div>

            <div style={{ maxWidth: '600px' }}>
                <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <h3>Account Info</h3>
                    <p>Username: Student (Mock)</p>
                    <p>Email: student@example.com (Mock)</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button style={{ padding: '10px', textAlign: 'left' }}>View Completed Items</button>
                    <button style={{ padding: '10px', textAlign: 'left' }}>Export Data</button>
                    <button style={{ padding: '10px', textAlign: 'left' }}>Toggle Light/Dark Mode</button>
                    <button style={{ padding: '10px', textAlign: 'left' }}>Select Accent Color</button>
                    <button
                        onClick={handleLogout}
                        style={{ padding: '10px', textAlign: 'left', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
