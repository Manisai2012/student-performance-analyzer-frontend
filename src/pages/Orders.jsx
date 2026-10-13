import React, { useState, useEffect } from 'react';
import api from '../services/api';

const API_BASE_URL = '/orders';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({ customerName: '', product: '', quantity: '', status: 'Pending' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get(API_BASE_URL).catch(() => ({ data: [] }));
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`${API_BASE_URL}/${editingId}`, formData).catch(console.error);
      } else {
        await api.post(API_BASE_URL, formData).catch(console.error);
      }
      setFormData({ customerName: '', product: '', quantity: '', status: 'Pending' });
      setEditingId(null);
      fetchOrders();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleEdit = (order) => {
    setFormData({ customerName: order.customerName, product: order.product, quantity: order.quantity, status: order.status });
    setEditingId(order.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`${API_BASE_URL}/${id}`).catch(console.error);
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">Orders</h2>
      
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Customer Name" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Product" value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} required />
            </div>
            <div className="col-md-2">
              <input type="number" className="form-control" placeholder="Quantity" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">{editingId ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td>
                    <span className={`badge bg-${order.status === 'Completed' ? 'success' : order.status === 'Processing' ? 'info' : 'warning'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(order)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(order.id)}>Delete</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="text-center py-4">No orders found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
