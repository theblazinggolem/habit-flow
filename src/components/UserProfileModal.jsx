import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfileModal = ({ user, onClose, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/logout', { method: 'POST' });
            if (res.ok) {
                onLogout();
                onClose();
                navigate('/login');
            }
        } catch (e) {
            console.error("Logout failed", e);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '400px', height: 'auto', maxHeight: 'none' }}>
                <div className="modal-header">
                    <h2>USER PROFILE</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
                    <div className="detail-row">
                        <span className="label">USERNAME</span>
                        <span className="value">{user?.username || 'UNKNOWN'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">EMAIL</span>
                        <span className="value">{user?.email || 'UNKNOWN'}</span>
                    </div>

                    <button
                        className="btn-save"
                        style={{ backgroundColor: 'var(--danger-color)', color: '#fff', width: '100%', marginTop: '20px' }}
                        onClick={handleLogout}
                    >
                        LOGOUT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
