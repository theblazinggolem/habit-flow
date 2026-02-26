import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import MainPanel from './components/MainPanel';
import CalendarWidget from './components/CalendarWidget';
import UpcomingWidget from './components/UpcomingWidget';
import ItemDetailModal from './components/ItemDetailModal';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserProfileModal from './components/UserProfileModal';


const INITIAL_DATA = {
    tasks: [],
    goals: [],
    reminders: [],
    habits: []
};

function App() {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Check Auth on Mount
    useEffect(() => {
        fetch('/api/check-auth')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error("Not authenticated");
            })
            .then(data => {
                if (data.authenticated) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
                setAuthLoading(false);
            })
            .catch(() => {
                setUser(null);
                setAuthLoading(false);
            });
    }, []);

    if (authLoading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#09090B', color: '#fff' }}>LOADING...</div>;

    const handleLogout = () => {
        fetch('/api/logout', { method: 'POST' })
            .then(() => setUser(null));
    };

    return (
        <BrowserRouter>
            <Toaster position="bottom-right" theme="dark" />
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={setUser} />} />
                <Route path="/register" element={<RegisterPage onLogin={setUser} />} />
                <Route path="/*" element={
                    user ? <ProtectedLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
                } />
            </Routes>
        </BrowserRouter>
    );
}

// Separate component to handle data fetching after auth
const ProtectedLayout = ({ user, onLogout }) => {
    const [data, setData] = useState(INITIAL_DATA);
    const [filterDate, setFilterDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [tags, setTags] = useState(() => {
        return user?.custom_tags || [];
    });
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                setIsProfileOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    // Fetch Data
    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch('/api/tasks').then(res => res.json()),
            fetch('/api/goals').then(res => res.json()),
            fetch('/api/reminders').then(res => res.json()),
            fetch('/api/habits').then(res => res.json())
        ])
            .then(([tasks, goals, reminders, habits]) => {
                // Handle potential unauthorized redirect responses or errors
                if (tasks.error || goals.error) throw new Error("Fetch failed");
                setData({ tasks, goals, reminders, habits });
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load data:", err);
                setLoading(false);
            });
    }, [user]);

    const handleAdd = async (type, item) => {
        // Optimistic UI Update
        const tempId = Date.now();
        const optimisticItem = { ...item, id: tempId };
        setData(prev => ({ ...prev, [type]: [...prev[type], optimisticItem] }));

        try {
            const res = await fetch(`/api/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            const result = await res.json();
            if (result.success) {
                // Update with real ID if backend provides it
                if (result.id) {
                    setData(prev => ({
                        ...prev,
                        [type]: prev[type].map(i => i.id === tempId ? { ...i, id: result.id } : i)
                    }));
                }
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            toast.error("Failed to add item");
            // Revert
            setData(prev => ({ ...prev, [type]: prev[type].filter(i => i.id !== tempId) }));
        }
    };

    const handleUpdate = async (type, id, field, value) => {
        // Optimistic
        const originalItem = data[type].find(i => i.id === id);
        setData(prev => ({
            ...prev,
            [type]: prev[type].map(i => i.id === id ? { ...i, [field]: value } : i)
        }));

        try {
            const res = await fetch(`/api/${type}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value })
            });
            if (!res.ok) throw new Error("Update failed");
        } catch (err) {
            toast.error("Failed to update item");
            // Revert
            if (originalItem) {
                setData(prev => ({
                    ...prev,
                    [type]: prev[type].map(i => i.id === id ? originalItem : i)
                }));
            }
        }
    };

    const handleDelete = (type, id) => {
        const originalList = data[type];
        const itemToDelete = originalList.find(i => i.id === id);

        // Optimistic UI Removal
        setData(prev => ({ ...prev, [type]: prev[type].filter(i => i.id !== id) }));

        let isReverted = false;

        const executeDelete = async () => {
            if (isReverted) return;
            try {
                const res = await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error("Delete failed");
            } catch (err) {
                toast.error("Failed to delete item");
                setData(prev => ({ ...prev, [type]: originalList }));
            }
        };

        const timeoutId = window.setTimeout(executeDelete, 4500);

        toast.success(type === 'habits' ? "Habit archived" : "Item deleted", {
            action: {
                label: 'UNDO',
                onClick: () => {
                    isReverted = true;
                    clearTimeout(timeoutId);
                    // Add back optimistically
                    setData(prev => ({ ...prev, [type]: [...prev[type], itemToDelete] }));
                }
            },
            actionButtonStyle: { backgroundColor: '#fff', color: '#09090B' }
        });
    };

    const handleDeleteMultiple = (type, ids) => {
        // Optimistic
        const originalList = data[type];
        const itemsToDelete = originalList.filter(i => ids.includes(i.id));

        setData(prev => ({ ...prev, [type]: prev[type].filter(i => !ids.includes(i.id)) }));

        let isReverted = false;

        const executeDelete = async () => {
            if (isReverted) return;
            try {
                await Promise.all(ids.map(id => fetch(`/api/${type}/${id}`, { method: 'DELETE' })));
            } catch (err) {
                toast.error("Failed to delete items");
                setData(prev => ({ ...prev, [type]: originalList }));
            }
        };

        const timeoutId = window.setTimeout(executeDelete, 4500);

        toast.success(type === 'habits' ? `${ids.length} habits archived` : `${ids.length} items deleted`, {
            action: {
                label: 'UNDO',
                onClick: () => {
                    isReverted = true;
                    clearTimeout(timeoutId);
                    // Add back optimistically
                    setData(prev => ({ ...prev, [type]: [...prev[type], ...itemsToDelete] }));
                }
            },
            actionButtonStyle: { backgroundColor: '#fff', color: '#09090B' }
        });
    };

    const handleItemClick = (type, item) => setSelectedItem({ ...item, type });
    const handleCloseModal = () => setSelectedItem(null);

    const handleAddTag = async (newTagInput) => {
        let newTag = newTagInput;
        if (!newTag || typeof newTag !== 'string') newTag = window.prompt("Enter new tag name:");
        if (newTag) {
            const normalized = newTag.trim().toUpperCase();
            if (normalized && !tags.includes(normalized)) {
                const newTagsList = [...tags, normalized];
                setTags(newTagsList);

                // Save custom tags to backend
                try {
                    await fetch('/api/user/tags', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tags: newTagsList })
                    });
                    toast.success(`Tag "${normalized}" created`);
                } catch (err) {
                    toast.error("Failed to save tag to backend");
                }
            }
        }
    }

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#09090B', color: '#fff', fontFamily: 'monospace' }}>
                LOADING DATA...
            </div>
        );
    }

    return (
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
            <ItemDetailModal
                key={selectedItem ? selectedItem.id : 'closed'}
                selectedItem={selectedItem}
                onClose={handleCloseModal}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                tags={tags}
                onAddTag={handleAddTag}
            />
            {isProfileOpen && (
                <UserProfileModal
                    user={user}
                    onClose={() => setIsProfileOpen(false)}
                    onLogout={onLogout}
                />
            )}
        </div>
    );
};

export default App;
