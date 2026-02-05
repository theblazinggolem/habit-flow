import React, { useState } from 'react';

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const CalendarWidget = ({ filterDate, setFilterDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const changeMonth = (dir) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(month + dir);
        setCurrentDate(newDate);
    };

    const getDaysInMonth = (y, m) => {
        return new Date(y, m + 1, 0).getDate();
    };

    const getFirstDay = (y, m) => {
        return new Date(y, m, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDay(year, month);

    const days = [];
    // Empty slots
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="cal-day empty"></div>);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const mStr = (month + 1).toString().padStart(2, "0");
        const dStr = day.toString().padStart(2, "0");
        const dateStr = `${year}-${mStr}-${dStr}`;

        const isSelected = dateStr === filterDate;
        const isToday = !isSelected && (
            new Date().getDate() === day &&
            new Date().getMonth() === month &&
            new Date().getFullYear() === year
        );

        days.push(
            <div
                key={day}
                className={`cal-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => setFilterDate(dateStr)}
            >
                {day}
            </div>
        );
    }

    return (
        <div className="calendar-widget">
            <div className="cal-header">
                <button className="cal-nav-btn" onClick={() => changeMonth(-1)}>
                    &lt;
                </button>
                <span id="calMonthYear">{MONTH_NAMES[month]} {year}</span>
                <button className="cal-nav-btn" onClick={() => changeMonth(1)}>
                    &gt;
                </button>
            </div>
            <div className="cal-grid">
                <div className="cal-day-name">Su</div>
                <div className="cal-day-name">Mo</div>
                <div className="cal-day-name">Tu</div>
                <div className="cal-day-name">We</div>
                <div className="cal-day-name">Th</div>
                <div className="cal-day-name">Fr</div>
                <div className="cal-day-name">Sa</div>
            </div>
            <div className="cal-grid" id="calDays">
                {days}
            </div>
        </div>
    );
};

export default CalendarWidget;
