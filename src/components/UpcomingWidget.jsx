import React from 'react';

const UpcomingWidget = ({ data, filterDate, setFilterDate }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filterFn;
    let titleText;

    if (filterDate) {
        titleText = `EVENTS: ${filterDate}`;
        filterFn = (item) => item.date === filterDate;
    } else {
        titleText = "UPCOMING (7 DAYS)";
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        filterFn = (item) => {
            if (!item.date) return false;
            const d = new Date(item.date);
            d.setHours(0, 0, 0, 0);
            return d >= today && d <= nextWeek;
        };
    }

    const allItems = [];
    if (data.tasks) data.tasks.forEach(i => { if (filterFn(i)) allItems.push({ ...i, type: 'TASK' }) });
    if (data.goals) data.goals.forEach(i => { if (filterFn(i)) allItems.push({ ...i, type: 'GOAL' }) });
    if (data.reminders) data.reminders.forEach(i => { if (filterFn(i)) allItems.push({ ...i, type: 'REMINDER' }) });
    if (data.habits) data.habits.forEach(i => { if (filterFn(i)) allItems.push({ ...i, type: 'HABIT' }) });

    allItems.sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="upcoming-widget">
            <div className="section-header">
                <span className="section-title" id="upcomingTitle">{titleText}</span>
                <button className="reset-btn" onClick={() => setFilterDate(null)}>
                    SHOW ALL
                </button>
            </div>
            <div className="upcoming-list" id="upcomingList">
                {allItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#555' }}>No events found</div>
                ) : (
                    allItems.map((item, idx) => (
                        <div key={`${item.type}-${item.id}-${idx}`} className="upcoming-item">
                            <div className="up-meta">
                                <span>{item.type}</span>
                                <span>{item.date}</span>
                            </div>
                            <div style={{ fontWeight: 'bold' }}>{item.text}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UpcomingWidget;
