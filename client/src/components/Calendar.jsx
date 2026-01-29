import React, { useState } from 'react';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const dates = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
        dates.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        dates.push(i);
    }

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    }

    return (
        <div style={{ padding: '10px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>&lt;</button>
                <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>&gt;</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center', fontSize: '0.8rem' }}>
                {days.map(d => <div key={d} style={{ color: '#888' }}>{d}</div>)}
                {dates.map((d, i) => (
                    <div key={i} style={{
                        padding: '5px',
                        borderRadius: '50%',
                        backgroundColor: d && isToday(d) ? 'white' : 'transparent',
                        color: d && isToday(d) ? 'black' : 'inherit',
                        cursor: d ? 'pointer' : 'default',
                        opacity: d ? 1 : 0
                    }}>
                        {d}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
