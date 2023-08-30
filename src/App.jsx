import React, { createContext, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Homepage from './pages/Homepage/Homepage'
import Dashboard from './pages/Dashboard/Dashboard'

export const UserContext = createContext()

function App() {

  const [token, setToken] = useState(localStorage.getItem('tasktracker-authtoken'))

  const BASE_USER_URL = 'https://newtral-io.onrender.com/api/user'
  const BASE_TASK_URL = 'https://newtral-io.onrender.com/api/tasks'

  return (
    <UserContext.Provider value={{ BASE_USER_URL, BASE_TASK_URL, token, setToken }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to='/homepage' replace={true} />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App;
