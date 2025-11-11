import React, { useRef, useState } from 'react';
import { BASE_URL } from '../App.jsx';

export default function EditOrder({ order, token, onSaved }) {
  const dialogRef = useRef(null);
  const [form, setForm] = useState({
    orderId: order.orderId,
    orderDate: order.orderDate,
    item: order.item,
    quantity: order.quantity,
    price: order.price,
  });
  const [error, setError] = useState('');

  const open = () => {
    setForm({
      orderId: order.orderId,
      orderDate: order.orderDate,
      item: order.item,
      quantity: order.quantity,
      price: order.price,
    });
    setError('');
    dialogRef.current.showModal();
  };

  const close = () => {
    dialogRef.current.close();
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: form.orderId,
          orderDate: form.orderDate,
          item: form.item,
          quantity: Number(form.quantity),
          price: Number(form.price),
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Update failed');
      }
      close();
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.message || 'Update failed');
    }
  };

  return (
    <>
      <button type="button" onClick={open}>
        Edit
      </button>
      <dialog ref={dialogRef}>
        <form className="singleCol" onSubmit={onSubmit}>
          <label>
            OrderId
            <input
              className="readonly"
              name="orderId"
              value={form.orderId}
              readOnly
            />
          </label>
          <label>
            OrderDate
            <input
              className="readonly"
              name="orderDate"
              value={form.orderDate}
              readOnly
            />
          </label>
          <label>
            Item
            <input name="item" value={form.item} onChange={onChange} />
          </label>
          <label>
            Quantity
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={onChange}
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
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={close}>
            Cancel
          </button>
          {error && <div className="errorMessage">{error}</div>}
        </form>
      </dialog>
    </>
  );
}
