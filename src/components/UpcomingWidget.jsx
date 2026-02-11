import React from 'react';

const UpcomingWidget = ({ data, filterDate, setFilterDate, onItemClick }) => {
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

    const getTypePlural = (type) => {
        switch (type) {
            case 'TASK': return 'tasks';
            case 'GOAL': return 'goals';
            case 'REMINDER': return 'reminders';
            case 'HABIT': return 'habits';
            default: return 'tasks';
        }
    };

    return (
        <div className="upcoming-widget">
            <div className="section-header" style={{ justifyContent: filterDate ? 'space-between' : 'center' }}>
                <span className="section-title" id="upcomingTitle">{titleText.replace(" (7 DAYS)", "")}</span>
                {filterDate && (
                    <button
                        className="reset-btn icon-only"
                        onClick={() => setFilterDate(null)}
                        title="Show All"
                        style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
                    >
                        <img src="/assets/vectors/reload.svg" alt="Reload" style={{ width: '16px', height: '16px', display: 'block' }} />
                    </button>
                )}
            </div>
            <div className="upcoming-list" id="upcomingList">
                {allItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#555' }}>No events found</div>
                ) : (
                    allItems.map((item, idx) => (
                        <div
                            key={`${item.type}-${item.id}-${idx}`}
                            className="upcoming-item"
                            onClick={() => onItemClick && onItemClick(getTypePlural(item.type), item)}
                            style={{ cursor: 'pointer' }}
                        >
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
