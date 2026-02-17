import React, { useState } from 'react';
import { toast } from 'sonner';
import { FREQ_OPTS } from '../constants';
import CustomSelect from './CustomSelect';

const HabitsTab = ({ habits = [], onAdd, onUpdate, onDelete, onItemClick }) => {
    // Local state for new habit form
    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitFreq, setNewHabitFreq] = useState('DAILY');

    const toLocalISOString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Get last 7 days for the header/grid
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(toLocalISOString(d));
        }
        return days;
    };

    const last7Days = getLast7Days();

    const handleAddHabit = () => {
        if (!newHabitName.trim()) return;

        const newHabit = {
            text: newHabitName.toUpperCase(),
            frequency: newHabitFreq,
            date: toLocalISOString(new Date()),
            completions: [], // Array of objects { date: 'YYYY-MM-DD', completed: true }
            streak: 0
        };

        onAdd('habits', newHabit);
        setNewHabitName('');
        setNewHabitFreq('DAILY');
        toast.success("Habit created");
    };

    const toggleCompletion = (e, habit, dateStr) => {
        e.stopPropagation(); // Prevent opening modal

        const currentCompletions = habit.completions || [];
        const isCompleted = currentCompletions.some(c => c.date === dateStr && c.completed);

        let newCompletions;
        if (isCompleted) {
            // Remove/Toggle off
            newCompletions = currentCompletions.filter(c => c.date !== dateStr);
        } else {
            // Add
            newCompletions = [...currentCompletions, { date: dateStr, completed: true }];
        }

        // Optimistic update logic could be here, but we rely on onUpdate
        onUpdate('habits', habit.id, 'completions', newCompletions);

        // Recalculate streak (server side or here? Simple logic here)
        // We'll let the modal or a helper function calculate streak for display
    };

    const calculateStreak = (completions) => {
        if (!completions || completions.length === 0) return 0;

        const sorted = [...completions].sort((a, b) => new Date(b.date) - new Date(a.date));

        let currentStreak = 0;
        let d = new Date();

        // Check if today is completed or yesterday (to keep streak alive)
        let todayStr = toLocalISOString(d);
        let hasToday = sorted.some(c => c.date === todayStr);

        if (!hasToday) {
            d.setDate(d.getDate() - 1);
            todayStr = toLocalISOString(d);
            if (!sorted.some(c => c.date === todayStr)) return 0;
        }

        while (true) {
            const ds = toLocalISOString(d);
            if (sorted.some(c => c.date === ds)) {
                currentStreak++;
                d.setDate(d.getDate() - 1);
            } else {
                break;
            }
        }

        return currentStreak;
    };

    return (
        <div className="tab-content active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="habit-list" style={{ flex: 1 }}>
                {habits.map(habit => {
                    const streak = calculateStreak(habit.completions);
                    return (
                        <div
                            key={habit.id}
                            className="habit-row"
                            onClick={() => onItemClick('habits', habit)}
                        >
                            <div className="habit-info">
                                <span className="habit-name">{habit.text}</span>
                                {streak > 0 && (
                                    <div className="habit-streak">
                                        <img src="/assets/vectors/streak.svg" alt="streak" />
                                        <span>{streak} days</span>
                                    </div>
                                )}
                            </div>

                            <div className="habit-days">
                                {last7Days.map(date => {
                                    const isCompleted = (habit.completions || []).some(c => c.date === date);
                                    // Calculate isToday
                                    const todayStr = toLocalISOString(new Date());
                                    const isToday = date === todayStr;

                                    return (
                                        <div
                                            key={date}
                                            className={`day-check ${isCompleted ? 'completed' : ''} ${isToday ? 'is-today' : 'read-only'}`}
                                            onClick={(e) => {
                                                if (isToday) {
                                                    toggleCompletion(e, habit, date);
                                                } else {
                                                    e.stopPropagation(); // Just prevent bubbling, do nothing
                                                }
                                            }}
                                            title={isToday ? "Mark today as complete" : date}
                                        >
                                            {isCompleted && (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Habit Form */}
            <div className="input-area">
                <input
                    type="text"
                    className="input-text"
                    placeholder="NEW HABIT"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                />

                <div style={{ width: '150px' }}>
                    <CustomSelect
                        options={FREQ_OPTS}
                        value={newHabitFreq}
                        onChange={(val) => setNewHabitFreq(val)}
                        placeholder="FREQUENCY"
                        multiple={false}
                        direction="up"
                    />
                </div>

                <button className="add-btn" onClick={handleAddHabit}>ADD</button>
            </div>
        </div>
    );
};

export default HabitsTab;
