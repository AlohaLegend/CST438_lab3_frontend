import React, { useState } from 'react';
import { BASE_URL } from '../App.jsx';

export default function Order({ customerId, token, customerName }) {
  const [form, setForm] = useState({ item: '', quantity: 1, price: 0 });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors([]);
    try {
      const res = await fetch(`${BASE_URL}/customers/${customerId}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item: form.item,
          quantity: Number(form.quantity),
          price: Number(form.price),
        }),
      });

      if (res.ok || res.status === 201) {
        setMessage('Order created');
        setForm({ item: '', quantity: 1, price: 0 });
      } else {
        const body = await res.json().catch(() => null);
        if (body && body.errors) {
          setErrors(body.errors.map((e2) => e2.defaultMessage || String(e2)));
        } else {
          setErrors(['Order create failed']);
        }
      }
    } catch (err) {
      setErrors([err.message || 'Order create failed']);
    }
  };

  return (
    <form className="singleCol" onSubmit={onSubmit}>
      <div>Customer: {customerName} (ID {customerId})</div>
      <label>
        Item
        <input name="item" value={form.item} onChange={onChange} required />
      </label>
      <label>
        Quantity
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={onChange}
          required
        />
      </label>
      <label>
        Price
        <input
          type="number"
          step="0.01"
          name="price"
          value={form.price}
          onChange={onChange}
          required
        />
      </label>
      <button type="submit">Submit</button>
      {message && <div>{message}</div>}
      {errors.length > 0 && (
        <div className="errorMessage">
          {errors.map((m, i) => (
            <div key={i}>{m}</div>
          ))}
        </div>
      )}
    </form>
  );
}
