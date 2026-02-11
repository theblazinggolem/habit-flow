import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

const CustomSelect = ({ options = [], value, onChange, placeholder, multiple = false, direction = 'down', onAddNew, customTrigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [positionStyle, setPositionStyle] = useState({});
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    // Close on click outside and scroll
    useEffect(() => {
        const handleInteraction = (e) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setIsOpen(false);
                setIsAddingNew(false);
            }
        };

        const handleScroll = () => {
            // Optional: Close on scroll to avoid detached floating menu
            if (isOpen) setIsOpen(false);
        };

        document.addEventListener('mousedown', handleInteraction);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('mousedown', handleInteraction);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    // Intelligent positioning with Portal
    useLayoutEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;

            let style = {
                position: 'fixed',
                zIndex: 99999,
                width: 'max-content',
                minWidth: '220px',
                maxWidth: '300px'
            };

            // 1. Vertical Positioning
            const spaceBelow = windowHeight - rect.bottom;
            const spaceAbove = rect.top;

            if (spaceBelow < 260 && spaceAbove > spaceBelow) {
                // Flip Up
                style.bottom = `${windowHeight - rect.top + 4}px`;
                style.top = 'auto';
            } else {
                // Down
                style.top = `${rect.bottom + 4}px`;
                style.bottom = 'auto';
            }

            // 2. Horizontal Positioning
            if (customTrigger) {
                // Center alignment for icon buttons
                const centerX = rect.left + (rect.width / 2);
                const approxHalfWidth = 120; // 240px / 2

                if (centerX - approxHalfWidth < 10) {
                    // Too close to left edge -> Align Left
                    style.left = `${rect.left}px`;
                } else if (centerX + approxHalfWidth > windowWidth - 10) {
                    // Too close to right edge -> Align Right
                    style.left = 'auto';
                    style.right = `${windowWidth - rect.right}px`;
                } else {
                    // Center
                    style.left = `${centerX}px`;
                    style.transform = 'translateX(-50%)';
                }
            } else {
                // Default Left Align for full bars
                // Check if it overflows right
                if (rect.left + 240 > windowWidth) {
                    style.left = 'auto';
                    style.right = `${windowWidth - rect.right}px`;
                } else {
                    style.left = `${rect.left}px`;
                }
            }

            setPositionStyle(style);
        }
    }, [isOpen, customTrigger]);

    const toggleOption = (option) => {
        if (multiple) {
            const arr = Array.isArray(value) ? value : [];
            const newValue = arr.includes(option)
                ? arr.filter(v => v !== option)
                : [...arr, option];
            onChange(newValue);
        } else {
            onChange(option);
            setIsOpen(false);
        }
    };

    const isSelected = (opt) => {
        if (multiple) {
            return Array.isArray(value) && value.includes(opt);
        }
        return value === opt;
    };

    const displayValue = () => {
        if (multiple) {
            if (!value || (Array.isArray(value) && value.length === 0)) {
                return <span className="placeholder">{placeholder}</span>;
            }
            return value.join(', ');
        } else {
            if (!value) return <span className="placeholder">{placeholder}</span>;
            return value;
        }
    };

    const handleNewTagSubmit = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            const val = e.target.value.trim();
            if (val) {
                onAddNew(val);
                e.target.value = '';
                setIsAddingNew(false);
            }
        }
        if (e.key === 'Escape') {
            setIsAddingNew(false);
        }
    };

    // Helper to check for empty state in dropdown
    const isOptionsEmpty = !options || options.length === 0;

    const dropdownMenu = (
        <div
            className={`custom-select-options ${direction}`}
            style={positionStyle}
            ref={dropdownRef}
        >
            {isOptionsEmpty ? (
                <div className="custom-select-empty" style={{ padding: '12px' }}>
                    <span className="cs-empty-label">NO {placeholder || 'ITEMS'}</span>
                    <div className="cs-divider"></div>
                    {onAddNew && (
                        <div
                            className="cs-add-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsAddingNew(true);
                            }}
                            style={{
                                padding: '4px 8px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                minHeight: '28px'
                            }}
                        >
                            {isAddingNew ? (
                                <input
                                    type="text"
                                    placeholder={`NEW ${placeholder ? placeholder.slice(0, -1) : 'ITEM'}`}
                                    className="cs-new-input"
                                    onKeyDown={handleNewTagSubmit}
                                    autoFocus
                                    onBlur={() => setIsAddingNew(false)}
                                    // prevent closing when clicking input
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    + NEW {placeholder ? placeholder.slice(0, -1) : 'ITEM'}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {options.map(opt => {
                        const active = isSelected(opt);
                        return (
                            <div
                                key={opt}
                                className={`custom-option ${active ? 'selected' : ''}`}
                                onClick={() => toggleOption(opt)}
                            >
                                <span style={{ fontWeight: 'bold' }}>{opt}</span>
                                {multiple && (
                                    <div className={`custom-option-checkbox ${active ? 'checked' : ''}`}>
                                        {active && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '10px', height: '8px' }}>
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.70679 0.299173C9.89454 0.491682 10 0.752721 10 1.02489C10 1.29706 9.89454 1.5581 9.70679 1.75061L4.35965 6.94828C4.17166 7.14061 3.91684 7.24864 3.65115 7.24864C3.38546 7.24864 3.13064 7.14061 2.94265 6.94828L0.269084 4.20945C0.0919866 4.01484 -0.00442659 3.75734 0.000156199 3.49127C0.00473898 3.22519 0.10996 2.97133 0.293651 2.78315C0.477343 2.59498 0.725164 2.48719 0.984902 2.48249C1.24464 2.47781 1.49603 2.57657 1.68608 2.75799L3.65115 4.77103L8.2898 0.299173C8.4778 0.108422 8.73262 0.000389332 8.99829 0.000389332C9.26398 0.000389332 9.5188 0.108422 9.70679 0.299173Z" fill="#18181B" />
                                            </svg>
                                        )}
                                    </div>
                                )}
                                {!multiple && active && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.70679 0.299173C9.89454 0.491682 10 0.752721 10 1.02489C10 1.29706 9.89454 1.5581 9.70679 1.75061L4.35965 6.94828C4.17166 7.14061 3.91684 7.24864 3.65115 7.24864C3.38546 7.24864 3.13064 7.14061 2.94265 6.94828L0.269084 4.20945C0.0919866 4.01484 -0.00442659 3.75734 0.000156199 3.49127C0.00473898 3.22519 0.10996 2.97133 0.293651 2.78315C0.477343 2.59498 0.725164 2.48719 0.984902 2.48249C1.24464 2.47781 1.49603 2.57657 1.68608 2.75799L3.65115 4.77103L8.2898 0.299173C8.4778 0.108422 8.73262 0.000389332 8.99829 0.000389332C9.26398 0.000389332 9.5188 0.108422 9.70679 0.299173Z" fill="currentColor" />
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                    {onAddNew && (
                        <div
                            className="cs-dropdown-action"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsAddingNew(true);
                            }}
                            style={{ padding: '0' }}
                        >
                            {isAddingNew ? (
                                <input
                                    type="text"
                                    placeholder={`NEW ${placeholder ? placeholder.slice(0, -1) : 'TAG'}`}
                                    className="cs-new-input-action"
                                    onKeyDown={handleNewTagSubmit}
                                    autoFocus
                                    onBlur={() => setIsAddingNew(false)}
                                    // prevent closing when clicking input
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <div style={{ padding: '12px 14px', width: '100%', cursor: 'pointer' }}>
                                    <span>+ NEW {placeholder ? placeholder.slice(0, -1) : 'TAG'}</span>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );

    return (
        <div className="custom-select-container" ref={containerRef} style={{ position: 'relative' }}>
            <div className="custom-select-trigger-wrapper" onClick={() => setIsOpen(!isOpen)}>
                {customTrigger ? customTrigger : (
                    <div className="custom-select-trigger">
                        <span style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '90%'
                        }}>{displayValue()}</span>

                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                            flexShrink: 0
                        }}>
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                )}
            </div>
            {isOpen && createPortal(dropdownMenu, document.body)}
        </div>
    );
};

export default CustomSelect;
