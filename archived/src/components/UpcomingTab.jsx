import React from 'react';

const UpcomingTab = ({ items }) => {
    // items prop should be a combined list of tasks, goals, reminders
    // filtered by date in the parent or here

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Upcoming Tasks</div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {items.length === 0 ? (
                    <div style={{ color: '#888', fontStyle: 'italic' }}>No upcoming items</div>
                ) : (
                    items.map((item, index) => (
                        <div key={index} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                            <strong>{item.title}</strong>
                            <div style={{ fontSize: '0.8em', color: '#666' }}>{item.date}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UpcomingTab;
