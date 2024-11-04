import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import VehicleDetails from './pages/VehicleDetails';
import VehicleListing from './pages/VehicleListing';
import BookingSuccess from './pages/BookingSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<VehicleListing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          <Route path="/booking/success" element={<BookingSuccess />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;