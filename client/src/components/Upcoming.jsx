import React from 'react';

const Upcoming = () => {
    // Mock data for now
    const upcomingItems = [
        { type: 'TASK', title: 'lorem ipsum sit doli34', time: 'TODAY AT 4PM' },
        { type: 'TASK', title: 'frferke rejneqw', time: 'TODAY AT 4PM' },
        { type: 'TASK', title: 'lorem ipsum sit doli34', time: 'TODAY AT 4PM' },
    ];

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="header-title">UPCOMING</div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                {upcomingItems.map((item, i) => (
                    <div key={i} style={{ marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#888', marginBottom: '2px' }}>
                            <span>{item.type}</span>
                            <span>{item.time}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{item.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Upcoming;
