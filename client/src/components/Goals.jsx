import React, { useState, useEffect } from 'react';
import api from '../api';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState('');
    const [newPriority, setNewPriority] = useState('');
    const [newDate, setNewDate] = useState('');

    const fetchGoals = async () => {
        try {
            const response = await api.get('/goals/');
            setGoals(response.data);
        } catch (error) {
            console.error("Error fetching goals", error);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleAdd = async () => {
        if (!newGoal) return;
        try {
            const goalData = {
                goal: newGoal,
                priority: newPriority || 'MEDIUM',
                date: newDate || new Date().toISOString().split('T')[0]
            };
            await api.post('/goals/', goalData);
            setNewGoal('');
            setNewPriority('');
            setNewDate('');
            fetchGoals();
        } catch (error) {
            console.error("Error adding goal", error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>GOAL</th>
                            <th>PRIORITY</th>
                            <th>DATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {goals.map(goal => (
                            <tr key={goal.id}>
                                <td>{goal.goal}</td>
                                <td>{goal.priority}</td>
                                <td>{goal.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="input-bar">
                <input
                    type="text"
                    placeholder="NEW GOAL"
                    className="input-field"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                />
                <select
                    className="input-select"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                >
                    <option value="">PRIORITY</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                </select>
                <input
                    type="date"
                    className="input-select"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                />
                <button className="add-btn" onClick={handleAdd}>ADD</button>
            </div>
        </div>
    );
};

export default Goals;
