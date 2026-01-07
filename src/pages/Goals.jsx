import React, { useState } from 'react';
import Drawer from '../components/Drawer';

const Goals = () => {
    const [goals, setGoals] = useState([
        { id: 1, goal: 'Learn React', priority: 'high', date: '2023-12-31' },
        { id: 2, goal: 'Read 10 Books', priority: 'medium', date: '2023-12-31' },
    ]);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleEdit = (goal) => {
        setSelectedGoal(goal);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedGoal(null);
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <input type="text" placeholder="Add a goal..." style={{ padding: '10px', width: '300px', marginRight: '10px' }} />
                <button style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>Add Goal</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Goal</th>
                        <th style={{ padding: '10px' }}>Priority</th>
                        <th style={{ padding: '10px' }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {goals.map(goal => (
                        <tr
                            key={goal.id}
                            onClick={() => handleEdit(goal)}
                            style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
                        >
                            <td style={{ padding: '10px' }}>{goal.goal}</td>
                            <td style={{ padding: '10px' }}>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    backgroundColor: goal.priority === 'high' ? '#f8d7da' : '#e2e3e5',
                                    color: goal.priority === 'high' ? '#721c24' : 'inherit',
                                    fontSize: '0.85em'
                                }}>
                                    {goal.priority}
                                </span>
                            </td>
                            <td style={{ padding: '10px' }}>{goal.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} title="Edit Goal">
                {selectedGoal && (
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <label>
                            Goal
                            <input type="text" defaultValue={selectedGoal.goal} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                        </label>
                        <label>
                            Priority
                            <select defaultValue={selectedGoal.priority} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </label>
                        <label>
                            Date
                            <input type="date" defaultValue={selectedGoal.date} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                        </label>
                        <button type="button" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Save Changes</button>
                    </form>
                )}
            </Drawer>
        </div>
    );
};

export default Goals;
