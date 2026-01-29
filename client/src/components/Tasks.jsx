import React, { useState, useEffect } from 'react';
import api from '../api';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [newTag, setNewTag] = useState('');
    const [newDate, setNewDate] = useState('');

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks/');
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAdd = async () => {
        if (!newTask) return;
        try {
            const taskData = {
                task: newTask,
                status: 'NOT STARTED',
                tags: newTag ? [newTag] : [],
                date: newDate || new Date().toISOString().split('T')[0]
            };
            await api.post('/tasks/', taskData);
            setNewTask('');
            setNewTag('');
            setNewDate('');
            fetchTasks();
        } catch (error) {
            console.error("Error adding task", error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>STATUS</th>
                            <th>TASK</th>
                            <th>TAG</th>
                            <th>DATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.id}>
                                <td><span className={`status-badge status-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span></td>
                                <td>{task.task}</td>
                                <td>{task.tags.join(', ')}</td>
                                <td>{task.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Input Area */}
            <div className="input-bar">
                <input
                    type="text"
                    placeholder="NEW TASK"
                    className="input-field"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <select
                    className="input-select"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                >
                    <option value="">PICK TAGS</option>
                    <option value="PROJECTS">PROJECTS</option>
                    <option value="HOMEWORK">HOMEWORK</option>
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

export default Tasks;
