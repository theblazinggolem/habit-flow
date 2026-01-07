import React, { useState } from 'react';
import Drawer from '../components/Drawer';

const Tasks = () => {
    const [tasks, setTasks] = useState([
        { id: 1, task: 'Finish Project', tags: ['Work', 'Important'], date: '2023-10-25', status: 'started', note: 'Almost done' },
        { id: 2, task: 'Buy Groceries', tags: ['Personal'], date: '2023-10-26', status: 'not started', note: '' },
    ]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleEdit = (task) => {
        setSelectedTask(task);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedTask(null);
    };

    const handleSave = (e) => {
        e.preventDefault();
        // Logic to save task would go here
        setIsDrawerOpen(false);
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <input type="text" placeholder="Add a task..." style={{ padding: '10px', width: '300px', marginRight: '10px' }} />
                <button style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>Add Task</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Task</th>
                        <th style={{ padding: '10px' }}>Status</th>
                        <th style={{ padding: '10px' }}>Tags</th>
                        <th style={{ padding: '10px' }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr
                            key={task.id}
                            onClick={() => handleEdit(task)}
                            style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
                        >
                            <td style={{ padding: '10px' }}>{task.task}</td>
                            <td style={{ padding: '10px' }}>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    backgroundColor: task.status === 'started' ? '#fff3cd' : '#e2e3e5',
                                    fontSize: '0.85em'
                                }}>
                                    {task.status}
                                </span>
                            </td>
                            <td style={{ padding: '10px' }}>{task.tags.join(', ')}</td>
                            <td style={{ padding: '10px' }}>{task.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Drawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                title={selectedTask ? "Edit Task" : "New Task"}
            >
                {selectedTask && (
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <label>
                            Task
                            <input type="text" defaultValue={selectedTask.task} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                        </label>
                        <label>
                            Status
                            <select defaultValue={selectedTask.status} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                                <option value="not started">Not Started</option>
                                <option value="started">Started</option>
                                <option value="completed">Completed</option>
                            </select>
                        </label>
                        <label>
                            Tags
                            <input type="text" defaultValue={selectedTask.tags.join(', ')} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                        </label>
                        <label>
                            Date
                            <input type="date" defaultValue={selectedTask.date} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                        </label>
                        <label>
                            Note
                            <textarea defaultValue={selectedTask.note} style={{ width: '100%', padding: '8px', marginTop: '5px' }} rows={4} />
                        </label>
                        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Save Changes
                        </button>
                    </form>
                )}
            </Drawer>
        </div>
    );
};

export default Tasks;
