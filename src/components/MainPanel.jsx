import React, { useState } from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { Plus } from 'lucide-react'; // Using standard icon if available, or text

const STATUS_OPTS = ["NOT STARTED", "IN PROGRESS", "COMPLETED", "ON HOLD", "CANCELLED"];
const TAG_OPTS = ["PROJECTS", "HOMEWORK", "PERSONAL", "WORK"];
const PRIORITY_OPTS = ["LOW", "MEDIUM", "HIGH"];
const REPEAT_OPTS = ["NONE", "DAILY", "WEEKLY", "BI-WEEKLY", "MONTHLY"];
const FREQ_OPTS = ["DAILY", "WEEKLY", "MONTHLY"];

const MainPanel = ({ data, onAdd, onUpdate, onDelete, filterDate }) => {
    // Local state for inputs
    const [inputs, setInputs] = useState({
        text: '',
        tag: 'PROJECTS',
        priority: 'MEDIUM',
        repeat: 'NONE',
        freq: 'DAILY',
        time: '09:00',
        date: filterDate || new Date().toISOString().split('T')[0]
    });

    // Update date if filterDate changes from outside (optional sync)
    React.useEffect(() => {
        if (filterDate) {
            setInputs(prev => ({ ...prev, date: filterDate }));
        }
    }, [filterDate]);

    const handleChange = (field, value) => {
        setInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleAdd = (type) => {
        if (!inputs.text) return;
        const newItem = {
            text: inputs.text.toUpperCase(),
            date: inputs.date
        };

        if (type === 'tasks') {
            newItem.status = "NOT STARTED";
            newItem.tag = inputs.tag;
        } else if (type === 'goals') {
            newItem.priority = inputs.priority;
        } else if (type === 'reminders') {
            newItem.time = inputs.time;
            newItem.repeat = inputs.repeat;
        } else if (type === 'habits') {
            newItem.frequency = inputs.freq;
            newItem.streak = 0;
        }

        onAdd(type, newItem);
        setInputs(prev => ({ ...prev, text: '' })); // Clear text only
    };

    // Context Menu State
    const [contextMenu, setContextMenu] = useState(null);

    const handleContextMenu = (e, type, id) => {
        e.preventDefault();
        setContextMenu({
            x: e.pageX,
            y: e.pageY,
            type,
            id
        });
    };

    const closeContextMenu = () => setContextMenu(null);

    const handleDelete = () => {
        if (contextMenu) {
            onDelete(contextMenu.type, contextMenu.id);
            closeContextMenu();
        }
    };

    React.useEffect(() => {
        const handleClick = () => closeContextMenu();
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    // Generic List Renderer
    const renderList = (type, items, columns, renderRow) => (
        <div className="tab-content active">
            <div className={`list-header grid-${type}`}>
                {columns.map(c => <span key={c}>{c}</span>)}
            </div>
            <div className="list-container">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`list-row grid-${type}`}
                        onContextMenu={(e) => handleContextMenu(e, type, item.id)}
                    >
                        {renderRow(item)}
                    </div>
                ))}
            </div>
            <div className="input-area">
                {renderInputs(type)}
            </div>
        </div>
    );

    const renderInputs = (type) => {
        return (
            <>
                <input
                    type="text"
                    className="input-text"
                    placeholder={`NEW ${type.slice(0, -1).toUpperCase()}`}
                    value={inputs.text}
                    onChange={(e) => handleChange('text', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd(type)}
                />

                {type === 'tasks' && (
                    <select className="input-sm" value={inputs.tag} onChange={(e) => handleChange('tag', e.target.value)}>
                        {TAG_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                )}

                {type === 'goals' && (
                    <select className="input-sm" value={inputs.priority} onChange={(e) => handleChange('priority', e.target.value)}>
                        {PRIORITY_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                )}

                {type === 'reminders' && (
                    <>
                        <select className="input-sm" value={inputs.repeat} onChange={(e) => handleChange('repeat', e.target.value)}>
                            {REPEAT_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <input
                            type="time"
                            className="input-xs"
                            value={inputs.time}
                            onChange={(e) => handleChange('time', e.target.value)}
                        />
                    </>
                )}

                {type === 'habits' && (
                    <select className="input-sm" value={inputs.freq} onChange={(e) => handleChange('freq', e.target.value)}>
                        {FREQ_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                )}

                <input
                    type="date"
                    className="input-sm"
                    value={inputs.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                />
                <button className="add-btn" onClick={() => handleAdd(type)}>ADD</button>
            </>
        );
    };

    // Editable Cell Component
    const Editable = ({ value, onChange, type = "text", options }) => {
        const [editing, setEditing] = useState(false);

        if (editing) {
            if (options) {
                return (
                    <select
                        className="editable-input"
                        value={value}
                        onChange={(e) => { onChange(e.target.value); setEditing(false); }}
                        onBlur={() => setEditing(false)}
                        autoFocus
                    >
                        {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                );
            }
            return (
                <input
                    type={type}
                    className="editable-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={() => setEditing(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
                    autoFocus
                />
            );
        }

        return (
            <span className="editable" onClick={() => setEditing(true)}>{value}</span>
        );
    };

    return (
        <main className="main-panel">
            <nav className="tabs">
                <NavLink to="/tasks" className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}>TASKS</NavLink>
                <NavLink to="/goals" className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}>GOALS</NavLink>
                <NavLink to="/reminders" className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}>REMINDERS</NavLink>
                <NavLink to="/habits" className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}>HABITS</NavLink>
            </nav>

            <Routes>
                <Route path="/" element={<Navigate to="/tasks" replace />} />

                <Route path="/tasks" element={renderList('tasks', data.tasks, ['STATUS', 'TASK', 'TAG', 'DATE'], (item) => (
                    <>
                        <Editable value={item.status} options={STATUS_OPTS} onChange={(v) => onUpdate('tasks', item.id, 'status', v)} />
                        <Editable value={item.text} onChange={(v) => onUpdate('tasks', item.id, 'text', v)} />
                        <Editable value={item.tag} options={TAG_OPTS} onChange={(v) => onUpdate('tasks', item.id, 'tag', v)} />
                        <Editable value={item.date} type="date" onChange={(v) => onUpdate('tasks', item.id, 'date', v)} />
                    </>
                ))} />

                <Route path="/goals" element={renderList('goals', data.goals, ['GOAL', 'PRIORITY', 'DATE'], (item) => (
                    <>
                        <Editable value={item.text} onChange={(v) => onUpdate('goals', item.id, 'text', v)} />
                        <Editable value={item.priority} options={PRIORITY_OPTS} onChange={(v) => onUpdate('goals', item.id, 'priority', v)} />
                        <Editable value={item.date} type="date" onChange={(v) => onUpdate('goals', item.id, 'date', v)} />
                    </>
                ))} />

                <Route path="/reminders" element={renderList('reminders', data.reminders, ['REMINDER', 'DATE', 'TIME', 'REPEAT'], (item) => (
                    <>
                        <Editable value={item.text} onChange={(v) => onUpdate('reminders', item.id, 'text', v)} />
                        <Editable value={item.date} type="date" onChange={(v) => onUpdate('reminders', item.id, 'date', v)} />
                        <Editable value={item.time} type="time" onChange={(v) => onUpdate('reminders', item.id, 'time', v)} />
                        <Editable value={item.repeat} options={REPEAT_OPTS} onChange={(v) => onUpdate('reminders', item.id, 'repeat', v)} />
                    </>
                ))} />

                <Route path="/habits" element={renderList('habits', data.habits || [], ['HABIT', 'FREQUENCY', 'DATE'], (item) => (
                    <>
                        <Editable value={item.text} onChange={(v) => onUpdate('habits', item.id, 'text', v)} />
                        <Editable value={item.frequency} options={FREQ_OPTS} onChange={(v) => onUpdate('habits', item.id, 'frequency', v)} />
                        <Editable value={item.date} type="date" onChange={(v) => onUpdate('habits', item.id, 'date', v)} />
                    </>
                ))} />
            </Routes>

            {contextMenu && (
                <div
                    className="context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="ctx-item" onClick={handleDelete}>Delete Item</div>
                </div>
            )}
        </main>
    );
};

export default MainPanel;
