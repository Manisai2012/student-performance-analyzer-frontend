import React, { useState, useEffect } from 'react';
import api from '../services/api';

const API_BASE_URL = '/products';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', category: '', price: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get(API_BASE_URL).catch(() => ({ data: [] }));
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
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
      setFormData({ name: '', category: '', price: '' });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setFormData({ name: product.name, category: product.category, price: product.price });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`${API_BASE_URL}/${id}`).catch(console.error);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">Products</h2>
      
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <input type="number" className="form-control" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-primary w-100">{editingId ? 'Update' : 'Add'} Product</button>
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
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(product)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product.id)}>Delete</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="5" className="text-center py-4">No products found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
