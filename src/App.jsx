import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import MainPanel from './components/MainPanel';
import CalendarWidget from './components/CalendarWidget';
import UpcomingWidget from './components/UpcomingWidget';
import ItemDetailModal from './components/ItemDetailModal';
import INITIAL_TAGS from '../data/tags.json';

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
    const [selectedItem, setSelectedItem] = useState(null);

    // Global User Tags initialized from JSON
    const [tags, setTags] = useState(INITIAL_TAGS);

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
                setLoading(false);
            });
    }, []);

    // Update specific file
    const saveData = (type, newTypeData) => {
        setData(prev => ({ ...prev, [type]: newTypeData }));

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

    const handleDeleteMultiple = (type, ids) => {
        const newTypeData = data[type].filter(item => !ids.includes(item.id));
        saveData(type, newTypeData);
    };

    const handleItemClick = (type, item) => {
        setSelectedItem({ ...item, type });
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    // Add new tag handler
    const handleAddTag = (newTagInput) => {
        let newTag = newTagInput;
        if (!newTag || typeof newTag !== 'string') {
            // Fallback if called without arg
            newTag = window.prompt("Enter new tag name:");
        }

        if (newTag) {
            const normalized = newTag.trim().toUpperCase();
            if (normalized && !tags.includes(normalized)) {
                setTags(prev => [...prev, normalized]);
                toast.success(`Tag "${normalized}" created`);
            } else if (tags.includes(normalized)) {
                toast.info("Tag already exists");
            }
        }
    }

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
            <Toaster position="bottom-right" theme="dark" />
            <div className="dashboard-container">
                <MainPanel
                    data={data}
                    onAdd={handleAdd}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onDeleteMultiple={handleDeleteMultiple}
                    onItemClick={handleItemClick}
                    filterDate={filterDate}
                    tags={tags}
                    onAddTag={handleAddTag}
                />
                <aside className="sidebar">
                    <CalendarWidget filterDate={filterDate} setFilterDate={setFilterDate} />
                    <UpcomingWidget
                        data={data}
                        filterDate={filterDate}
                        setFilterDate={setFilterDate}
                        onItemClick={handleItemClick}
                    />
                </aside>
            </div>

            <ItemDetailModal
                key={selectedItem ? selectedItem.id : 'closed'}
                selectedItem={selectedItem}
                onClose={handleCloseModal}
                onUpdate={handleUpdate}
                tags={tags}
                onAddTag={handleAddTag}
            />
        </BrowserRouter>
    );
}

export default App;
