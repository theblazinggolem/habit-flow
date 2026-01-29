import React, { useState, useEffect } from 'react';
import api from '../api';

const Habits = () => {
    const [habits, setHabits] = useState([]);
    const [newHabit, setNewHabit] = useState('');
    const [frequency, setFrequency] = useState('');

    const fetchHabits = async () => {
        try {
            const response = await api.get('/habits/');
            setHabits(response.data);
        } catch (error) {
            console.error("Error fetching habits", error);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const toggleComplete = async (id) => {
        // Optimistic update or refetch - for now simple alert or log as logic needs logic for "completed today"
        // The backend tracks completed_dates array.
        // Implementing toggle logic requires checking if today is in that array and adding/removing it.
        // For simplicity in this step, let's just log.
        console.log("Toggle complete for", id);
        // To implement correctly we need a specific endpoint or update the habit's completed_dates
    };

    const handleAdd = async () => {
        if (!newHabit) return;
        try {
            await api.post('/habits/', {
                habit: newHabit,
                frequency: frequency || 'DAILY'
            });
            setNewHabit('');
            setFrequency('');
            fetchHabits();
        } catch (error) {
            console.error("Error adding habit", error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                {habits.map(habit => (
                    <div key={habit.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: 'transparent', // TODO: Check if completed today
                        borderRadius: '8px',
                        marginBottom: '10px'
                    }}>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{habit.habit}</div>
                            <div style={{ color: '#888', fontSize: '0.9rem' }}>Streak: {habit.completed_dates?.length || 0} 🔥</div>
                        </div>
                        <button
                            onClick={() => toggleComplete(habit.id)}
                            style={{
                                border: '1px solid white',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                backgroundColor: 'transparent',
                                color: 'white'
                            }}
                        >
                            MARK DONE
                        </button>
                    </div>
                ))}
            </div>

            <div className="input-bar">
                <input
                    type="text"
                    placeholder="NEW HABIT"
                    className="input-field"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                />
                <select
                    className="input-select"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                >
                    <option value="">DAILY</option>
                    <option value="WEEKLY">WEEKLY</option>
                </select>
                <button className="add-btn" onClick={handleAdd}>ADD</button>
            </div>
        </div>
    );
};

export default Habits;
