import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainPanel from './components/MainPanel';
import CalendarWidget from './components/CalendarWidget';
import UpcomingWidget from './components/UpcomingWidget';

const INITIAL_STATE = {
    tasks: [],
    goals: [],
    reminders: [],
    habits: []
};

function App() {
    const [data, setData] = useState(INITIAL_STATE);
    const [filterDate, setFilterDate] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch data on mount
    React.useEffect(() => {
        Promise.all([
            fetch('/api/tasks').then(res => res.json()),
            fetch('/api/goals').then(res => res.json()),
            fetch('/api/reminders').then(res => res.json()),
            fetch('/api/habits').then(res => res.json())
        ])
            .then(([tasks, goals, reminders, habits]) => {
                setData({ tasks, goals, reminders, habits });
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load data:", err);
                // Even if failed, stop loading to show UI (maybe empty)
                setLoading(false);
            });
    }, []);

    // Update specific file
    const saveData = (type, newTypeData) => {
        // Optimistic UI update
        setData(prev => ({ ...prev, [type]: newTypeData }));

        // Save to server
        fetch(`/api/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTypeData)
        }).catch(err => console.error(`Failed to save ${type}:`, err));
    };

    const handleAdd = (type, item) => {
        const newItem = { ...item, id: Date.now() };
        const newTypeData = [...(data[type] || []), newItem];
        saveData(type, newTypeData);
    };

    const handleUpdate = (type, id, field, value) => {
        const newTypeData = data[type].map(item => item.id === id ? { ...item, [field]: value } : item);
        saveData(type, newTypeData);
    };

    const handleDelete = (type, id) => {
        const newTypeData = data[type].filter(item => item.id !== id);
        saveData(type, newTypeData);
    };

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#09090B',
                color: '#fff',
                fontFamily: 'monospace'
            }}>
                LOADING DATA...
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div className="dashboard-container">
                <MainPanel
                    data={data}
                    onAdd={handleAdd}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    filterDate={filterDate}
                />
                <aside className="sidebar">
                    <CalendarWidget filterDate={filterDate} setFilterDate={setFilterDate} />
                    <UpcomingWidget data={data} filterDate={filterDate} setFilterDate={setFilterDate} />
                </aside>
            </div>
        </BrowserRouter>
    );
}

export default App;
