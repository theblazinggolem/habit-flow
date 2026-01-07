import React, { useState } from 'react';

const Calendar = ({ onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const startDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const renderDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentDate);
        const startDay = startDayOfMonth(currentDate);

        // Empty cells for days before start of month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} style={{ padding: '10px' }}></div>);
        }

        // Days of the month
        for (let i = 1; i <= totalDays; i++) {
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toDateString();
            days.push(
                <div
                    key={i}
                    onClick={() => onDateSelect(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))}
                    style={{
                        padding: '10px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: isToday ? '#007bff' : 'transparent',
                        color: isToday ? 'white' : 'inherit',
                        borderRadius: '50%'
                    }}
                >
                    {i}
                </div>
            );
        }
        return days;
    };

    return (
        <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ textAlign: 'center' }}>
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontWeight: 'bold' }}>{d}</div>
                ))}
                {renderDays()}
            </div>
        </div>
    );
};

export default Calendar;
