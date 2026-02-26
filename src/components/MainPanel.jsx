import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { STATUS_OPTS, TAG_OPTS, PRIORITY_OPTS, REPEAT_OPTS, FREQ_OPTS } from '../constants';
import CustomSelect from './CustomSelect';
import HabitsTab from './HabitsTab';

const MainPanel = ({ data, onAdd, onUpdate, onDelete, onDeleteMultiple, onItemClick, filterDate, tags = [], onAddTag }) => {
    const [selectedIds, setSelectedIds] = useState([]);
    // Local state for inputs
    const [inputs, setInputs] = useState({
        text: '',
        tags: [],
        priority: '', // Empty to show placeholder
        repeat: 'NONE',
        freq: 'DAILY',
        time: '09:00',
        date: filterDate || new Date().toISOString().split('T')[0]
    });

    // Update date if filterDate changes from outside
    useEffect(() => {
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
            // Use array directly from inputs.tags or default
            newItem.tags = (inputs.tags && inputs.tags.length > 0) ? inputs.tags : [];
        } else if (type === 'goals') {
            newItem.priority = inputs.priority || "MEDIUM";
        } else if (type === 'reminders') {
            newItem.time = inputs.time;
            newItem.repeat = inputs.repeat;
        } else if (type === 'habits') {
            newItem.frequency = inputs.freq;
            newItem.streak = 0;
        }

        onAdd(type, newItem);
        toast.success("New item added successfully");
        setInputs(prev => ({ ...prev, text: '', tags: [], priority: '' }));
    };

    const panelRef = useRef(null);

    // Context Menu State
    const [contextMenu, setContextMenu] = useState(null);

    const handleContextMenu = (e, type, id) => {
        e.preventDefault();

        if (!panelRef.current) return;

        const rect = panelRef.current.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        const MENU_WIDTH = 150;
        const MENU_HEIGHT = 80;

        const containerWidth = rect.width;
        const containerHeight = rect.height;

        if (x + MENU_WIDTH > containerWidth) x = containerWidth - MENU_WIDTH - 10;
        if (y + MENU_HEIGHT > containerHeight) y = containerHeight - MENU_HEIGHT - 10;

        setContextMenu({ x, y, type, id });
    };

    const closeContextMenu = () => setContextMenu(null);

    const handleDelete = () => {
        if (contextMenu) {
            if (selectedIds.length > 1 && selectedIds.includes(contextMenu.id)) {
                onDeleteMultiple(contextMenu.type, selectedIds);
                setSelectedIds([]);
            } else {
                onDelete(contextMenu.type, contextMenu.id);
                setSelectedIds(prev => prev.filter(id => id !== contextMenu.id));
            }
            closeContextMenu();
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check for Cmd (Mac) or Ctrl (Windows)
            const isModKey = e.metaKey || e.ctrlKey;

            if (isModKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        navigate('/tasks');
                        break;
                    case '2':
                        e.preventDefault();
                        navigate('/goals');
                        break;
                    case '3':
                        e.preventDefault();
                        navigate('/reminders');
                        break;
                    case '4':
                        e.preventDefault();
                        navigate('/habits');
                        break;
                    default:
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);

    useEffect(() => {
        const handleClick = () => closeContextMenu();
        const handleResize = () => closeContextMenu();
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedIds([]);
            }
        };

        document.addEventListener('click', handleClick);
        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('click', handleClick);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleRowClick = (e, type, item) => {
        const isModKey = e.metaKey || e.ctrlKey;

        if (isModKey) {
            e.stopPropagation();
            setSelectedIds(prev =>
                prev.includes(item.id)
                    ? prev.filter(id => id !== item.id)
                    : [...prev, item.id]
            );
        } else {
            setSelectedIds([item.id]);
            onItemClick(type, item);
        }
    };

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
                        className={`list-row grid-${type}${selectedIds.includes(item.id) ? ' selected' : ''}`}
                        onContextMenu={(e) => {
                            if (!selectedIds.includes(item.id)) setSelectedIds([item.id]);
                            handleContextMenu(e, type, item.id);
                        }}
                        onClick={(e) => handleRowClick(e, type, item)}
                        style={{ cursor: 'pointer' }}
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
                    <div style={{ width: '200px' }}>
                        <CustomSelect
                            options={tags}
                            value={inputs.tags}
                            onChange={(val) => handleChange('tags', val)}
                            placeholder="TAGS"
                            multiple={true}
                            direction="up"
                            onAddNew={onAddTag}
                        />
                    </div>
                )}

                {type === 'goals' && (
                    <div style={{ width: '150px' }}>
                        <CustomSelect
                            options={PRIORITY_OPTS}
                            value={inputs.priority}
                            onChange={(val) => handleChange('priority', val)}
                            placeholder="PRIORITY"
                            multiple={false}
                            direction="up"
                        />
                    </div>
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

    const Cell = ({ value }) => {
        let displayValue = value;
        if (Array.isArray(value)) {
            displayValue = value.join(', ');
        }
        return (
            <span className="editable" style={{ pointerEvents: 'none' }}>{displayValue}</span>
        );
    };

    return (
        <main className="main-panel" ref={panelRef}>
            <nav className="tabs">
                <NavLink to="/tasks" className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}>TASKS</NavLink>
                <NavLink to="/goals" className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}>GOALS</NavLink>
                <NavLink to="/reminders" className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}>REMINDERS</NavLink>
                <NavLink to="/habits" className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}>HABITS</NavLink>
            </nav>

            <Routes>
                <Route path="/" element={<Navigate to="/tasks" replace />} />

                <Route path="/tasks" element={renderList('tasks', data.tasks.filter(task => {
                    if (!task.date) return true;
                    const today = new Date().toISOString().split('T')[0];
                    return task.date >= today;
                }), ['STATUS', 'TASK', 'DATE'], (item) => (
                    <>
                        <Cell value={item.status} />
                        <Cell value={item.text} />
                        <Cell value={item.date} />
                    </>
                ))} />

                <Route path="/goals" element={renderList('goals', data.goals.filter(goal => {
                    if (!goal.date) return true;
                    const today = new Date().toISOString().split('T')[0];
                    return goal.date >= today;
                }), ['GOAL', 'PRIORITY', 'DATE'], (item) => (
                    <>
                        <Cell value={item.text} />
                        <Cell value={item.priority} />
                        <Cell value={item.date} />
                    </>
                ))} />

                <Route path="/reminders" element={renderList('reminders', data.reminders, ['REMINDER', 'DATE', 'TIME', 'REPEAT'], (item) => (
                    <>
                        <Cell value={item.text} />
                        <Cell value={item.date} />
                        <Cell value={item.time} />
                        <Cell value={item.repeat} />
                    </>
                ))} />

                <Route path="/habits" element={<HabitsTab
                    habits={data.habits || []}
                    onAdd={onAdd}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onItemClick={onItemClick}
                />} />
            </Routes>

            {contextMenu && (
                <div
                    className="context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="ctx-item" onClick={handleDelete}>
                        {selectedIds.length > 1 && selectedIds.includes(contextMenu.id)
                            ? contextMenu.type === 'habits' ? `Archive Selected (${selectedIds.length})` : `Delete Selected (${selectedIds.length})`
                            : contextMenu.type === 'habits' ? 'Archive Habit' : 'Delete Item'
                        }
                    </div>
                </div>
            )}
        </main>
    );
};

export default MainPanel;
