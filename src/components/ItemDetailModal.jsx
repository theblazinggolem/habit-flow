import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Modal from './Modal';
import { STATUS_OPTS, TAG_OPTS, PRIORITY_OPTS, REPEAT_OPTS, FREQ_OPTS } from '../constants';
import CustomSelect from './CustomSelect';

const ItemDetailModal = ({ selectedItem, onClose, onUpdate, tags = [], onAddTag }) => {
    // Local State
    const [editForm, setEditForm] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [activeField, setActiveField] = useState(null);

    // Initial sync
    useEffect(() => {
        if (selectedItem) {
            let tags = selectedItem.tag;
            if (typeof tags === 'string') {
                tags = [tags];
            } else if (!tags) {
                tags = [];
            }
            // Ensure tags is array for editForm
            setEditForm({ ...selectedItem, tag: tags, notes: selectedItem.notes || '' });
            setIsEditing(false);
            setActiveField(null);
        } else {
            setEditForm({});
        }
    }, [selectedItem]);

    const handleEditChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleTagEditChange = (value) => {
        // Value from CustomSelect is already an array for multi-select
        setEditForm(prev => ({ ...prev, tag: value }));
    };

    const saveChanges = () => {
        if (!selectedItem) return;
        let updateType = selectedItem.type;
        // Normalize singular uppercase to plural lowercase if needed
        if (updateType === 'TASK') updateType = 'tasks';
        if (updateType === 'GOAL') updateType = 'goals';
        if (updateType === 'REMINDER') updateType = 'reminders';
        if (updateType === 'HABIT') updateType = 'habits';

        const finalUpdates = { ...editForm };

        // Ensure tag is array for tasks
        if (updateType === 'tasks') {
            // It should be array from CustomSelect
            if (!Array.isArray(finalUpdates.tag)) {
                finalUpdates.tag = [];
            }
        }

        Object.keys(finalUpdates).forEach(key => {
            const oldVal = JSON.stringify(selectedItem[key]);
            const newVal = JSON.stringify(finalUpdates[key]);

            if (newVal !== oldVal) {
                onUpdate(updateType, selectedItem.id, key, finalUpdates[key]);
            }
        });

        toast.success("Changes saved successfully");
        onClose();
    };

    // Helper Components inside for clean structure
    const DetailRow = ({ fieldName, label, value, renderInput, customDisplay = null }) => {
        const isFieldActive = isEditing || activeField === fieldName;

        return (
            <div className="detail-row">
                <span className="detail-label">{label}</span>
                {isFieldActive ? (
                    renderInput()
                ) : (
                    <div
                        className="detail-value"
                        onClick={() => setActiveField(fieldName)}
                        style={{ cursor: 'pointer' }}
                    >
                        {customDisplay || (Array.isArray(value) ? value.join(', ') : value)}
                    </div>
                )}
            </div>
        );
    };

    const renderTags = (tags) => {
        let currentTags = [];
        if (Array.isArray(tags)) {
            currentTags = tags;
        } else if (typeof tags === 'string') {
            currentTags = tags.split(',').map(t => t.trim()).filter(Boolean);
        } else if (tags) {
            currentTags = [tags];
        }

        if (currentTags.length === 0) return "NO TAGS";

        return (
            <div className="tags-container" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                {currentTags.map((tag, idx) => (
                    <div key={idx} className="tag-chip" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'var(--bg-input)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                    }}>
                        {tag}
                    </div>
                ))}
            </div>
        );
    };

    if (!selectedItem) return null;

    // Determine type for display/logic
    let itemType = selectedItem.type;
    // Normalize for checks
    if (itemType === 'TASK') itemType = 'tasks';
    if (itemType === 'GOAL') itemType = 'goals';
    if (itemType === 'REMINDER') itemType = 'reminders';
    if (itemType === 'HABIT') itemType = 'habits';

    const labelTitle = itemType.replace(/s$/, '').toUpperCase();

    // Check for changes
    const hasChanges = React.useMemo(() => {
        if (!selectedItem) return false;

        const keys = Object.keys(editForm);
        for (let key of keys) {
            let val1 = editForm[key];
            let val2 = selectedItem[key];

            // Normalize tags for comparison
            if (key === 'tag') {
                if (!val1) val1 = [];
                if (!val2) val2 = [];
                if (typeof val2 === 'string') val2 = [val2];
                if (JSON.stringify(val1) !== JSON.stringify(val2)) return true;
                continue;
            }
            // Normalize notes
            if (key === 'notes') {
                if (!val1) val1 = '';
                if (!val2) val2 = '';
            }

            if (JSON.stringify(val1) !== JSON.stringify(val2)) return true;
        }
        return false;
    }, [editForm, selectedItem]);

    const handleMainAction = () => {
        if (hasChanges) {
            saveChanges();
            return;
        }

        if (!isEditing) {
            setIsEditing(true);
        } else {
            // Cancel mode
            setIsEditing(false);
            setActiveField(null);
            // Revert changes
            if (selectedItem) {
                let tags = selectedItem.tag;
                if (typeof tags === 'string') tags = [tags];
                else if (!tags) tags = [];
                setEditForm({ ...selectedItem, tag: tags, notes: selectedItem.notes || '' });
            }
        }
    };

    const getButtonText = () => {
        if (hasChanges) return "SAVE CHANGES";
        if (!isEditing) return "EDIT";
        return "CANCEL";
    };

    return (
        <Modal
            isOpen={!!selectedItem}
            onClose={onClose}
            title={`${labelTitle} DETAILS`}
        >
            <div className="modal-header-actions" style={{ position: 'absolute', top: '40px', right: '40px', marginRight: '40px' }}>
                <button className="btn-save" onClick={handleMainAction}>
                    {getButtonText()}
                </button>
            </div>

            <DetailRow
                fieldName="text"
                label={labelTitle}
                value={editForm.text}
                renderInput={() => (
                    <input
                        className="detail-input"
                        type="text"
                        value={editForm.text || ''}
                        onChange={(e) => handleEditChange('text', e.target.value)}
                        autoFocus
                    />
                )}
            />

            {itemType === 'tasks' && (
                <>
                    <DetailRow
                        fieldName="status"
                        label="STATUS"
                        value={editForm.status}
                        renderInput={() => (
                            <select
                                className="detail-input"
                                value={editForm.status}
                                onChange={(e) => handleEditChange('status', e.target.value)}
                                autoFocus
                            >
                                {STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        )}
                    />
                    <div className="detail-row" style={{ alignItems: 'flex-start' }}>
                        <span className="detail-label" style={{ marginTop: '8px' }}>TAGS</span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {editForm.tag && editForm.tag.map((tag, idx) => (
                                <div key={idx} className="tag-chip" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: 'var(--bg-input)',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)',
                                    height: '32px'
                                }}>
                                    {tag}
                                    {isEditing && (
                                        <span
                                            style={{ cursor: 'pointer', marginLeft: '4px', opacity: 0.7, display: 'flex', alignItems: 'center' }}
                                            onClick={() => {
                                                const newTags = editForm.tag.filter(t => t !== tag);
                                                handleTagEditChange(newTags);
                                            }}
                                        >
                                            <img src="/assets/vectors/bin.svg" alt="delete" style={{ width: '14px', height: '14px' }} />
                                        </span>
                                    )}
                                </div>
                            ))}
                            <div style={{ width: '40px' }}>
                                <CustomSelect
                                    options={tags}
                                    value={editForm.tag}
                                    onChange={handleTagEditChange}
                                    placeholder=""
                                    multiple={true}
                                    onAddNew={onAddTag}
                                    customTrigger={
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: 'var(--bg-input)',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            border: '1px solid var(--border-color)'
                                        }}>
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {itemType === 'goals' && (
                <div className="detail-row">
                    <span className="detail-label">PRIORITY</span>
                    <div style={{ width: '200px' }}>
                        <CustomSelect
                            options={PRIORITY_OPTS}
                            value={editForm.priority}
                            onChange={(val) => handleEditChange('priority', val)}
                            placeholder="PRIORITY"
                            multiple={false}
                            minimal={true}
                        />
                    </div>
                </div>
            )}

            {itemType === 'reminders' && (
                <>
                    <DetailRow
                        fieldName="time"
                        label="TIME"
                        value={editForm.time}
                        renderInput={() => (
                            <input
                                className="detail-input"
                                type="time"
                                value={editForm.time || ''}
                                onChange={(e) => handleEditChange('time', e.target.value)}
                                autoFocus
                            />
                        )}
                    />
                    <DetailRow
                        fieldName="repeat"
                        label="REPEAT"
                        value={editForm.repeat}
                        renderInput={() => (
                            <div style={{ width: '200px' }}>
                                <CustomSelect
                                    options={REPEAT_OPTS}
                                    value={editForm.repeat}
                                    onChange={(val) => handleEditChange('repeat', val)}
                                    placeholder="REPEAT"
                                    multiple={false}
                                />
                            </div>
                        )}
                    />
                </>
            )}

            {itemType === 'habits' && (
                <DetailRow
                    fieldName="frequency"
                    label="FREQUENCY"
                    value={editForm.frequency}
                    renderInput={() => (
                        <div style={{ width: '200px' }}>
                            <CustomSelect
                                options={FREQ_OPTS}
                                value={editForm.frequency}
                                onChange={(val) => handleEditChange('frequency', val)}
                                placeholder="FREQUENCY"
                                multiple={false}
                            />
                        </div>
                    )}
                />
            )}

            <DetailRow
                fieldName="date"
                label="DATE"
                value={editForm.date}
                customDisplay={
                    <span style={{ fontWeight: 'inherit', color: 'inherit', minWidth: '200px' }}>
                        {editForm.date}
                    </span>
                }
                renderInput={() => (
                    <div style={{ display: 'flex', alignItems: 'center', width: '200px' }}>
                        <input
                            className="detail-input"
                            type="text"
                            value={editForm.date || ''}
                            onChange={(e) => handleEditChange('date', e.target.value)}
                            autoFocus
                            placeholder="YYYY-MM-DD"
                        />
                    </div>
                )}
            />

            <div style={{ marginTop: '10px' }}>
                <span className="detail-label">NOTES</span>
                {(isEditing || activeField === 'notes') ? (
                    <textarea
                        className="detail-notes-input"
                        placeholder="Add notes..."
                        value={editForm.notes || ''}
                        onChange={(e) => handleEditChange('notes', e.target.value)}
                        autoFocus
                    />
                ) : (
                    <div
                        className="detail-notes"
                        onClick={() => setActiveField('notes')}
                        style={{ cursor: 'pointer' }}
                    >
                        {editForm.notes || "No notes"}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ItemDetailModal;
