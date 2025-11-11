import React, { useState } from 'react';
const BASE_URL = "http://localhost:8080";

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok && res.status !== 201 && res.status !== 200) {
        const msg = await res.text();
        throw new Error(msg || 'Register failed');
      }
      const id = await res.json();
      setResult(`Registered. Customer ID: ${id}`);
    } catch (err) {
      setError(err.message || 'Register failed');
    }
  };

  return (
    <form className="singleCol" onSubmit={onSubmit}>
      <label>
        Name
        <input name="name" value={form.name} onChange={onChange} required />
      </label>
      <label>
        Email
        <input name="email" value={form.email} onChange={onChange} required />
      </label>
      <label>
        Password
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          required
        />
      </label>
      <button type="submit">Register</button>
      {result && <div>{result}</div>}
      {error && <div className="errorMessage">{error}</div>}
    </form>
  );
}
