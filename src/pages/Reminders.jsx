import React, { useState } from 'react';
import Drawer from '../components/Drawer';

const Reminders = () => {
    const [reminders, setReminders] = useState([
        { id: 1, reminder: 'Drink Water', time: '10:00', date: '2023-10-25', repeat: 'daily' },
        { id: 2, reminder: 'Meeting', time: '14:00', date: '2023-10-25', repeat: 'no repeat' },
    ]);
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleEdit = (reminder) => {
        setSelectedReminder(reminder);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedReminder(null);
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <input type="text" placeholder="Add a reminder..." style={{ padding: '10px', width: '300px', marginRight: '10px' }} />
                <button style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>Add Reminder</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Reminder</th>
                        <th style={{ padding: '10px' }}>Time</th>
                        <th style={{ padding: '10px' }}>Date</th>
                        <th style={{ padding: '10px' }}>Repeat</th>
                    </tr>
                </thead>
                <tbody>
                    {reminders.map(rem => (
                        <tr
                            key={rem.id}
                            onClick={() => handleEdit(rem)}
                            style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
                        >
                            <td style={{ padding: '10px' }}>{rem.reminder}</td>
                            <td style={{ padding: '10px' }}>{rem.time}</td>
                            <td style={{ padding: '10px' }}>{rem.date}</td>
                            <td style={{ padding: '10px' }}>{rem.repeat}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} title="Edit Reminder">
                {selectedReminder && (
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <label>
                            Reminder
                            <input type="text" defaultValue={selectedReminder.reminder} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                        </label>
                        <label>
                            Time
                            <input type="time" defaultValue={selectedReminder.time} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                        </label>
                        <label>
                            Date
                            <input type="date" defaultValue={selectedReminder.date} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                        </label>
                        <label>
                            Repeat
                            <select defaultValue={selectedReminder.repeat} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                                <option value="no repeat">No Repeat</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </label>
                        <button type="button" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Save Changes</button>
                    </form>
                )}
            </Drawer>
        </div>
    );
};

export default Reminders;
