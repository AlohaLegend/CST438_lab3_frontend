import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { BASE_URL } from '../App.jsx';
import EditOrder from './EditOrder.jsx';

export default function OrderHistory({ customerId, token }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/customers/${customerId}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error('Failed to load orders');
      }
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, token]);

  const handleDelete = (orderId) => {
    confirmAlert({
      title: 'Confirm delete',
      message: 'Do you really want to delete this order?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!res.ok && res.status !== 204) {
                throw new Error('Delete failed');
              }
              fetchOrders();
            } catch (err) {
              setError(err.message || 'Delete failed');
            }
          },
        },
        { label: 'No' },
      ],
    });
  };

  return (
    <div>
      {error && <div className="errorMessage">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>OrderId</th>
            <th>Date</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.orderId}>
              <td>{o.orderId}</td>
              <td>{o.orderDate}</td>
              <td>{o.item}</td>
              <td>{o.quantity}</td>
              <td>{o.price}</td>
              <td>
                <EditOrder
                  order={o}
                  token={token}
                  onSaved={fetchOrders}
                />
              </td>
              <td>
                <button type="button" onClick={() => handleDelete(o.orderId)}>
                  Del
                </button>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="7">No orders</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
