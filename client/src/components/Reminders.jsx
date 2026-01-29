import React, { useState, useEffect } from 'react';
import api from '../api';

const Reminders = () => {
    const [reminders, setReminders] = useState([]);
    const [newReminder, setNewReminder] = useState('');
    const [newTime, setNewTime] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newRepeat, setNewRepeat] = useState('');

    const fetchReminders = async () => {
        try {
            const response = await api.get('/reminders/');
            setReminders(response.data);
        } catch (error) {
            console.error("Error fetching reminders", error);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    const handleAdd = async () => {
        if (!newReminder) return;
        try {
            const item = {
                reminder: newReminder,
                time: newTime || '09:00:00', // Ensure time format
                date: newDate || new Date().toISOString().split('T')[0],
                repeat: newRepeat || 'NO REPEAT'
            };
            await api.post('/reminders/', item);
            setNewReminder('');
            setNewTime('');
            setNewDate('');
            setNewRepeat('');
            fetchReminders();
        } catch (error) {
            console.error("Error adding reminder", error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>REMINDER</th>
                            <th>TIME</th>
                            <th>DATE</th>
                            <th>REPEAT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reminders.map(reminder => (
                            <tr key={reminder.id}>
                                <td>{reminder.reminder}</td>
                                <td>{reminder.time}</td>
                                <td>{reminder.date}</td>
                                <td>{reminder.repeat}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="input-bar">
                <input
                    type="text"
                    placeholder="NEW REMINDER"
                    className="input-field"
                    value={newReminder}
                    onChange={(e) => setNewReminder(e.target.value)}
                />
                <input
                    type="time"
                    className="input-select"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                />
                <input
                    type="date"
                    className="input-select"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                />
                <select
                    className="input-select"
                    value={newRepeat}
                    onChange={(e) => setNewRepeat(e.target.value)}
                >
                    <option value="">NO REPEAT</option>
                    <option value="DAILY">DAILY</option>
                    <option value="WEEKLY">WEEKLY</option>
                </select>
                <button className="add-btn" onClick={handleAdd}>ADD</button>
            </div>
        </div>
    );
};

export default Reminders;
