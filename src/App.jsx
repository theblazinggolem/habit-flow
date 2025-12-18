import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path='/tasks' element={<Tasks />} />
      <Route path='/goals' element={<Goals />} />
      <Route path='/reminders' element={<Reminders />} />
      <Route path='/habits' element={<Habits />} />

      <Route path='/settings' element={<Settings />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path="/" element={<Navigate to="/tasks" replace />} />
    </Routes>
  )
}

export default App
