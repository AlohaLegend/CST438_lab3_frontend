import React, { useState } from 'react';
const BASE_URL = "http://localhost:8080";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { email, password } = form;
    const basic = btoa(`${email}:${password}`);

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${basic}`,
        },
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();
      // expected: { customerId, name, jwtToken }
      if (!data.customerId || !data.jwtToken) {
        throw new Error('Invalid login response');
      }
      onLogin(data.customerId, data.jwtToken, data.name);
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <form className="singleCol" onSubmit={onSubmit}>
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
      <button type="submit">Login</button>
      {error && <div className="errorMessage">{error}</div>}
    </form>
  );
}
