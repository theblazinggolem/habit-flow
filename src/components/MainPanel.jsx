import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import Modal from './Modal';

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

    // Modal State
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    // Update date if filterDate changes from outside (optional sync)
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
        toast.success("New item added successfully");
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
            toast.success("Item deleted");
            closeContextMenu();
        }
    };

    useEffect(() => {
        const handleClick = () => closeContextMenu();
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    // Modal Logic
    const openModal = (type, item) => {
        setSelectedItem({ type, ...item });
        setEditForm({ ...item, notes: item.notes || '' });
        setIsEditing(false); // Default to view mode
    };

    const closeModal = () => {
        setSelectedItem(null);
        setEditForm({});
        setIsEditing(false);
    };

    const handleEditChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const saveChanges = () => {
        if (!selectedItem) return;
        const type = selectedItem.type;

        // Loop over keys in editForm and call onUpdate if changed or new (like notes)
        // We also want to ensure notes are saved even if other things aren't
        Object.keys(editForm).forEach(key => {
            if (editForm[key] !== selectedItem[key]) {
                onUpdate(type, selectedItem.id, key, editForm[key]);
            }
        });

        toast.success("Changes saved successfully");
        closeModal();
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
                        className={`list-row grid-${type}`}
                        onContextMenu={(e) => handleContextMenu(e, type, item.id)}
                        onClick={() => openModal(type, item)}
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

    const Cell = ({ value }) => (
        <span className="editable" style={{ pointerEvents: 'none' }}>{value}</span>
    );

    // Helpers for rendering detail rows
    const DetailRow = ({ label, value, isEditing, renderInput }) => (
        <div className="detail-row">
            <span className="detail-label">{label}</span>
            {isEditing ? renderInput() : <div className="detail-value">{value}</div>}
        </div>
    );

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
                        <Cell value={item.status} />
                        <Cell value={item.text} />
                        <Cell value={item.tag} />
                        <Cell value={item.date} />
                    </>
                ))} />

                <Route path="/goals" element={renderList('goals', data.goals, ['GOAL', 'PRIORITY', 'DATE'], (item) => (
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

                <Route path="/habits" element={renderList('habits', data.habits || [], ['HABIT', 'FREQUENCY', 'DATE'], (item) => (
                    <>
                        <Cell value={item.text} />
                        <Cell value={item.frequency} />
                        <Cell value={item.date} />
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

            <Modal
                isOpen={!!selectedItem}
                onClose={closeModal}
                title={`${selectedItem ? selectedItem.type.slice(0, -1).toUpperCase() : ''} DETAILS`}
            >
                {selectedItem && (
                    <>
                        <div className="modal-header-actions" style={{ position: 'absolute', top: '40px', right: '40px', marginRight: '40px' }}>
                            {isEditing ? (
                                <button className="btn-save" onClick={saveChanges}>SAVE CHANGES</button>
                            ) : (
                                <button className="btn-edit-toggle" onClick={() => setIsEditing(true)}>EDIT</button>
                            )}
                        </div>

                        <DetailRow
                            label={selectedItem.type.slice(0, -1).toUpperCase()}
                            value={editForm.text}
                            isEditing={isEditing}
                            renderInput={() => (
                                <input
                                    className="detail-input"
                                    type="text"
                                    value={editForm.text || ''}
                                    onChange={(e) => handleEditChange('text', e.target.value)}
                                />
                            )}
                        />

                        {selectedItem.type === 'tasks' && (
                            <>
                                <DetailRow
                                    label="STATUS"
                                    value={editForm.status}
                                    isEditing={isEditing}
                                    renderInput={() => (
                                        <select className="detail-input" value={editForm.status} onChange={(e) => handleEditChange('status', e.target.value)}>
                                            {STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    )}
                                />
                                <DetailRow
                                    label="TAGS"
                                    value={editForm.tag}
                                    isEditing={isEditing}
                                    renderInput={() => (
                                        <select className="detail-input" value={editForm.tag} onChange={(e) => handleEditChange('tag', e.target.value)}>
                                            {TAG_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    )}
                                />
                            </>
                        )}

                        {selectedItem.type === 'goals' && (
                            <DetailRow
                                label="PRIORITY"
                                value={editForm.priority}
                                isEditing={isEditing}
                                renderInput={() => (
                                    <select className="detail-input" value={editForm.priority} onChange={(e) => handleEditChange('priority', e.target.value)}>
                                        {PRIORITY_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                )}
                            />
                        )}

                        {selectedItem.type === 'reminders' && (
                            <>
                                <DetailRow
                                    label="TIME"
                                    value={editForm.time}
                                    isEditing={isEditing}
                                    renderInput={() => (
                                        <input
                                            className="detail-input"
                                            type="time"
                                            value={editForm.time || ''}
                                            onChange={(e) => handleEditChange('time', e.target.value)}
                                        />
                                    )}
                                />
                                <DetailRow
                                    label="REPEAT"
                                    value={editForm.repeat}
                                    isEditing={isEditing}
                                    renderInput={() => (
                                        <select className="detail-input" value={editForm.repeat} onChange={(e) => handleEditChange('repeat', e.target.value)}>
                                            {REPEAT_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    )}
                                />
                            </>
                        )}

                        {selectedItem.type === 'habits' && (
                            <DetailRow
                                label="FREQUENCY"
                                value={editForm.frequency}
                                isEditing={isEditing}
                                renderInput={() => (
                                    <select className="detail-input" value={editForm.frequency} onChange={(e) => handleEditChange('frequency', e.target.value)}>
                                        {FREQ_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                )}
                            />
                        )}

                        <DetailRow
                            label="DATE"
                            value={editForm.date}
                            isEditing={isEditing}
                            renderInput={() => (
                                <input
                                    className="detail-input"
                                    type="date"
                                    value={editForm.date || ''}
                                    onChange={(e) => handleEditChange('date', e.target.value)}
                                />
                            )}
                        />

                        <div style={{ marginTop: '10px' }}>
                            <span className="detail-label">NOTES</span>
                            {isEditing ? (
                                <textarea
                                    className="detail-notes-input"
                                    placeholder="Add notes..."
                                    value={editForm.notes || ''}
                                    onChange={(e) => handleEditChange('notes', e.target.value)}
                                />
                            ) : (
                                <div className="detail-notes">
                                    {editForm.notes || "No notes"}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Modal>
        </main>
    );
};

export default MainPanel;

