import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Marks from './pages/Marks';
import Booster from './pages/Booster';
import Reports from './pages/Reports';
import Students from './pages/Students';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="marks" element={<Marks />} />
            <Route path="booster" element={<Booster />} />
            <Route path="reports" element={<Reports />} />
            <Route path="students" element={<Students />} />

            {/* Backwards compatibility redirects */}
            <Route path="machines" element={<Navigate to="/marks" replace />} />
            <Route path="workers" element={<Navigate to="/students" replace />} />
            <Route path="products" element={<Navigate to="/marks" replace />} />
            <Route path="orders" element={<Navigate to="/reports" replace />} />
            <Route path="production" element={<Navigate to="/booster" replace />} />
            <Route path="maintenance" element={<Navigate to="/booster" replace />} />
            <Route path="alerts" element={<Navigate to="/booster" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
