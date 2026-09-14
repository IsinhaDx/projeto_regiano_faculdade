import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Participants from './pages/Participants';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { token } = useAuth();
    return token ? <AppLayout>{children}</AppLayout> : <Navigate to="/" replace />;
};

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
                    <Route path="/participants" element={<PrivateRoute><Participants /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
