import React, { useState } from 'react';
import Drawer from '../components/Drawer';
import ActivityCalendar from 'react-activity-calendar';

const Habits = () => {
    const [habits, setHabits] = useState([
        { id: 1, habit: 'Exercise', frequency: 'Daily', streak: 5 },
        { id: 2, habit: 'Meditation', frequency: 'Mon, Wed, Fri', streak: 2 },
    ]);
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleEdit = (habit) => {
        setSelectedHabit(habit);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedHabit(null);
    };

    // Mock data for contribution graph
    const generateMockData = () => {
        const data = [];
        const now = new Date();
        for (let i = 0; i < 180; i++) { // Past 6 months approx
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split('T')[0],
                count: Math.random() > 0.7 ? 1 : 0, // Random completions
                level: Math.random() > 0.7 ? 1 : 0
            });
        }
        return data.reverse(); // Newest last
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <input type="text" placeholder="Add a habit..." style={{ padding: '10px', width: '300px', marginRight: '10px' }} />
                <button style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>Add Habit</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {habits.map(habit => (
                    <div
                        key={habit.id}
                        onClick={() => handleEdit(habit)}
                        style={{
                            padding: '20px',
                            backgroundColor: 'white',
                            border: '1px solid #eee',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div>
                            <h3 style={{ margin: '0 0 5px 0' }}>{habit.habit}</h3>
                            <div style={{ color: '#666', fontSize: '0.9em' }}>{habit.frequency}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#dc3545' }}>{habit.streak} 🔥</div>
                            <div style={{ fontSize: '0.8em', color: '#888' }}>Current Streak</div>
                        </div>
                    </div>
                ))}
            </div>

            <Drawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                title={selectedHabit ? "Edit Habit" : "New Habit"}
            >
                {selectedHabit && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <label>
                                Habit Name
                                <input type="text" defaultValue={selectedHabit.habit} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                            </label>
                            <label>
                                Frequency
                                <input type="text" defaultValue={selectedHabit.frequency} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                            </label>
                            <button type="button" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Save Changes</button>
                        </form>

                        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <h4 style={{ marginTop: 0 }}>Progress (Last 6 Months)</h4>
                            <ActivityCalendar
                                data={generateMockData()}
                                theme={{
                                    light: ['#f0f0f0', '#0e4429', '#006d32', '#26a641', '#39d353'],
                                    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'], // GitHub green
                                }}
                            />
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default Habits;
