import React, { useState } from 'react';
import { toast } from 'sonner';

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const CalendarWidget = ({ filterDate, setFilterDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isEditingHeader, setIsEditingHeader] = useState(false);
    const [headerInputValue, setHeaderInputValue] = useState("");

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const changeMonth = (dir) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(month + dir);
        setCurrentDate(newDate);
    };

    const handleDateHeaderClick = () => {
        setHeaderInputValue(`${MONTH_NAMES[month]} ${year}`);
        setIsEditingHeader(true);
    };

    const handleHeaderSubmit = (e) => {
        if (e.key === 'Enter') {
            const input = headerInputValue.trim();
            if (!input) {
                setIsEditingHeader(false);
                return;
            }

            // Try to parse the input
            let targetDate = null;
            let targetDay = null;

            // Normalize separators to slashes
            const normalizedInput = input.replace(/[-.]/g, '/');
            const parts = normalizedInput.split('/');

            // 1. Try DD/MM/YYYY or D/M/YYYY
            if (parts.length === 3) {
                const d = parseInt(parts[0]);
                const m = parseInt(parts[1]) - 1;
                const y = parseInt(parts[2]);
                if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                    targetDate = new Date(y, m, 1);
                    targetDay = `${y}-${(m + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
                }
            }
            // 2. Try MM/YYYY or M/YYYY
            else if (parts.length === 2) {
                const m = parseInt(parts[0]) - 1;
                const y = parseInt(parts[1]);
                if (!isNaN(m) && !isNaN(y)) targetDate = new Date(y, m, 1);
            }

            // 3. Try "Month Year"
            if (!targetDate) {
                const searchStr = input.replace(',', '');
                const words = searchStr.split(/\s+/);
                if (words.length === 2) {
                    const mIdx = MONTH_NAMES.findIndex(name =>
                        name.toLowerCase().startsWith(words[0].toLowerCase())
                    );
                    const y = parseInt(words[1]);
                    if (mIdx !== -1 && !isNaN(y)) targetDate = new Date(y, mIdx, 1);
                }
            }

            // 4. Try "Day Month Year" (e.g., 8 March 2025)
            if (!targetDate) {
                const searchStr = input.replace(',', '');
                const words = searchStr.split(/\s+/);
                if (words.length === 3) {
                    const d = parseInt(words[0]);
                    const mIdx = MONTH_NAMES.findIndex(name =>
                        name.toLowerCase().startsWith(words[1].toLowerCase())
                    );
                    const y = parseInt(words[2]);
                    if (!isNaN(d) && mIdx !== -1 && !isNaN(y)) {
                        targetDate = new Date(y, mIdx, 1);
                        targetDay = `${y}-${(mIdx + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
                    }
                }
            }

            if (targetDate && !isNaN(targetDate.getTime())) {
                setCurrentDate(targetDate);
                if (targetDay) setFilterDate(targetDay);
                setIsEditingHeader(false);
            } else {
                toast.error("Format: 'July 2026', '10/02/2026', or '8 March 2025'");
            }
        } else if (e.key === 'Escape') {
            setIsEditingHeader(false);
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
                <div
                    className="cal-header-jump"
                    onClick={!isEditingHeader ? handleDateHeaderClick : undefined}
                    style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: isEditingHeader ? 'var(--bg-input)' : 'transparent',
                        border: 'none',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        width: '200px',
                        height: '36px',
                        justifyContent: 'center'
                    }}
                >
                    {isEditingHeader ? (
                        <input
                            type="text"
                            value={headerInputValue}
                            onChange={(e) => setHeaderInputValue(e.target.value)}
                            onKeyDown={handleHeaderSubmit}
                            onBlur={() => setIsEditingHeader(false)}
                            autoFocus
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                fontFamily: 'inherit',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                outline: 'none',
                                width: '100%',
                                paddingRight: '24px' // Leave space for icon
                            }}
                        />
                    ) : (
                        <span style={{ userSelect: 'none', fontWeight: 'bold', paddingRight: '24px' }}>
                            {MONTH_NAMES[month]} {year}
                        </span>
                    )}
                    <img
                        src="/assets/vectors/calendar.svg"
                        alt="calendar"
                        style={{
                            position: 'absolute',
                            right: '12px',
                            width: '14px',
                            height: '14px',
                            opacity: 0.8
                        }}
                    />
                </div>
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
        </div >
    );
};

export default CalendarWidget;
