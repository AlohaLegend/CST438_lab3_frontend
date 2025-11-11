import React, { useState } from 'react';
import { Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Order from './components/Order.jsx';
import OrderHistory from './components/OrderHistory.jsx';

export const BASE_URL = 'http://localhost:8080';

function AppLayout({ isAuthenticated, onLogout }) {
  return (
    <>
      <nav className="p-4 border-b mb-4 flex gap-4">
        <span className="text-3xl font-bold">Customer Order Management</span>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        {isAuthenticated && (
          <>
            <Link to="/order">Order</Link>
            <Link to="/history">Order History</Link>
            <button type="button" onClick={onLogout}>
              Logout
            </button>
          </>
        )}
      </nav>
      <Outlet />
    </>
  );
}

export default function App() {
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [token, setToken] = useState('');
  const isAuthenticated = !!token && !!customerId;

  const handleLogin = (id, jwtToken, name) => {
    setCustomerId(id);
    setToken(jwtToken);
    setCustomerName(name);
  };

  const handleLogout = () => {
    setCustomerId(null);
    setToken('');
    setCustomerName('');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<AppLayout isAuthenticated={isAuthenticated} onLogout={handleLogout} />}
      >
        <Route index element={<Navigate to="/register" />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="order"
          element={
            isAuthenticated ? (
              <Order customerId={customerId} token={token} customerName={customerName} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="history"
          element={
            isAuthenticated ? (
              <OrderHistory customerId={customerId} token={token} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Route>
    </Routes>
  );
}
