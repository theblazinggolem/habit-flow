import React, { useEffect, useState } from 'react';

const Drawer = ({ isOpen, onClose, title, children }) => {
    const [visible, setVisible] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            setTimeout(() => setVisible(false), 300); // Wait for animation
        }
    }, [isOpen]);

    if (!visible) return null;

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 999,
                    opacity: isOpen ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                }}
                onClick={onClose}
            />
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '400px',
                    height: '100%',
                    backgroundColor: 'white',
                    boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s ease',
                    padding: '20px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{title}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        &times;
                    </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {children}
                </div>
            </div>
        </>
    );
};

export default Drawer;
