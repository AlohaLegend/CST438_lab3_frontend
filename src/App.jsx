import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Order from "./components/Order.jsx";
import OrderHistory from "./components/OrderHistory.jsx";
import EditOrder from "./components/EditOrder.jsx";
import Settings from "./components/Settings.jsx";

function App() {
  return (
    <div>
      <nav
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          padding: "10px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <span style={{ fontWeight: "bold" }}>Customer Order Management</span>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/settings">Settings</Link>
      </nav>

      <div style={{ padding: "16px" }}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/orders/history" element={<OrderHistory />} />
          <Route path="/orders/:id/edit" element={<EditOrder />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
