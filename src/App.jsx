import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Sensors from './pages/Sensors';
import Reports from './pages/Reports';
import About from './pages/About';
import { useSocket } from './hooks/useSocket';

function App() {
  const { isConnected, lastReading } = useSocket();

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard isConnected={isConnected} lastReading={lastReading} />} />
        <Route path="/sensors" element={<Sensors lastReading={lastReading} />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
