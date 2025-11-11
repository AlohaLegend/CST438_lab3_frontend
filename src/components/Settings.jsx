import React, { useState } from "react";
const BASE_URL = "http://localhost:8080";

function Settings() {
  const storedName = sessionStorage.getItem("customerName") || "";
  const customerId = sessionStorage.getItem("customerId");
  const jwtToken = sessionStorage.getItem("jwtToken");

  const [name, setName] = useState(storedName);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  if (!customerId || !jwtToken) {
    return (
      <div className="singleCol">
        <h2>Account Settings</h2>
        <p>Please log in to manage your account.</p>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("");

    const updates = {};

    if (name && name !== storedName) {
      updates.name = name;
    }

    if (password.trim() !== "") {
      updates.password = password.trim();
    }

    if (Object.keys(updates).length === 0) {
      setStatus("No changes to save.");
      return;
    }

    // backend expects customerId
    const body = {
      customerId: Number(customerId),
      name: updates.name ?? null,
      password: updates.password ?? null,
    };

    try {
      const response = await fetch(`${BASE_URL}/customers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        setStatus(`Error saving settings (${response.status}).`);
        return;
      }

      if (updates.name) {
        sessionStorage.setItem("customerName", updates.name);
      }

      setPassword("");
      setStatus("Settings saved.");
    } catch (err) {
      setStatus("Network error while saving settings.");
    }
  };

  const handleUnregister = async () => {
    setStatus("");

    const confirmDelete = window.confirm(
      "Are you sure you want to unregister and delete your account and orders?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/customers/${customerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 204) {
        sessionStorage.clear();
        setStatus("Account deleted.");
      } else {
        setStatus(`Error deleting account (${response.status}).`);
      }
    } catch (err) {
      setStatus("Network error while deleting account.");
    }
  };

  return (
    <div className="singleCol">
      <h2>Account Settings</h2>

      <form onSubmit={handleSave}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          New Password
          <input
            type="password"
            value={password}
            placeholder="Leave blank to keep current password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit">Save</button>
      </form>

      <div style={{ marginTop: "16px" }}>
        <button type="button" onClick={handleUnregister}>
          Unregister
        </button>
      </div>

      {status && <p className="errorMessage">{status}</p>}
    </div>
  );
}

export default Settings;
