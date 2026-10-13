import React, { useState, useEffect } from 'react';
import api from '../services/api';

const API_BASE_URL = '/workers';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [formData, setFormData] = useState({ name: '', role: '', shift: 'Morning' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await api.get(API_BASE_URL).catch(() => ({ data: [] }));
      setWorkers(response.data || []);
    } catch (error) {
      console.error('Error fetching workers:', error);
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
      setFormData({ name: '', role: '', shift: 'Morning' });
      setEditingId(null);
      fetchWorkers();
    } catch (error) {
      console.error('Error saving worker:', error);
    }
  };

  const handleEdit = (worker) => {
    setFormData({ name: worker.name, role: worker.role, shift: worker.shift });
    setEditingId(worker.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`${API_BASE_URL}/${id}`).catch(console.error);
        fetchWorkers();
      } catch (error) {
        console.error('Error deleting worker:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">Workers</h2>
      
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Worker Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})}>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
              </select>
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-primary w-100">{editingId ? 'Update' : 'Add'} Worker</button>
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
                <th>Role</th>
                <th>Shift</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workers.length > 0 ? workers.map(worker => (
                <tr key={worker.id}>
                  <td>{worker.id}</td>
                  <td>{worker.name}</td>
                  <td>{worker.role}</td>
                  <td>{worker.shift}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(worker)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(worker.id)}>Delete</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="5" className="text-center py-4">No workers found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Workers;
