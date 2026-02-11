import React, { useState } from 'react';

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const CalendarWidget = ({ filterDate, setFilterDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const [isChoosingDate, setIsChoosingDate] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const changeMonth = (dir) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(month + dir);
        setCurrentDate(newDate);
    };

    const handleDateHeaderClick = () => {
        setIsChoosingDate(true);
    };

    const handleDateInputChange = (e) => {
        const val = e.target.value;
        if (val) {
            const [y, m] = val.split('-');
            const newDate = new Date(parseInt(y), parseInt(m) - 1, 1);
            setCurrentDate(newDate);
            setIsChoosingDate(false);
        }
    };

    // Calendar generation logic
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)

    // Previous month logic
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    const prevMonthDays = [];
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        prevMonthDays.push({
            day: prevMonthLastDate - i,
            type: 'prev',
            date: new Date(year, month - 1, prevMonthLastDate - i)
        });
    }

    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
        currentMonthDays.push({
            day: i,
            type: 'current',
            date: new Date(year, month, i)
        });
    }

    // Next month days to fill grid (42 cells usually covers all months)
    const storedDays = [...prevMonthDays, ...currentMonthDays];
    const remainingCells = 42 - storedDays.length;
    const nextMonthDays = [];
    for (let i = 1; i <= remainingCells; i++) {
        nextMonthDays.push({
            day: i,
            type: 'next',
            date: new Date(year, month + 1, i)
        });
    }

    const allDays = [...storedDays, ...nextMonthDays];

    return (
        <div className="calendar-widget">
            <div className="cal-header">
                <button className="cal-nav-btn" onClick={() => changeMonth(-1)}>
                    &lt;
                </button>
                {isChoosingDate ? (
                    <input
                        type="month"
                        className="cal-date-input"
                        value={`${year}-${(month + 1).toString().padStart(2, '0')}`}
                        onChange={handleDateInputChange}
                        onBlur={() => setIsChoosingDate(false)}
                        autoFocus
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontFamily: 'inherit',
                            fontSize: '1rem',
                            textAlign: 'center',
                            width: '140px',
                            cursor: 'pointer'
                        }}
                    />
                ) : (
                    <span
                        id="calMonthYear"
                        onClick={handleDateHeaderClick}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        title="Click to jump to date"
                    >
                        {MONTH_NAMES[month]} {year}
                    </span>
                )}
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
                {allDays.map((d, idx) => {
                    const mStr = (d.date.getMonth() + 1).toString().padStart(2, "0");
                    const dayStr = d.day.toString().padStart(2, "0");
                    const dateStr = `${d.date.getFullYear()}-${mStr}-${dayStr}`;

                    const isSelected = dateStr === filterDate;
                    const isToday = new Date().toDateString() === d.date.toDateString();
                    const isGray = d.type !== 'current';

                    return (
                        <div
                            key={idx}
                            className={`cal-day ${d.type} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                            onClick={() => setFilterDate(dateStr)}
                            style={{
                                color: isGray ? '#3f3f46' : undefined,
                                pointerEvents: isGray ? 'none' : 'auto',
                            }}
                        >
                            {d.day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarWidget;
