import React, { useState, useEffect } from 'react';
import api from '../services/api';

const API_BASE_URL = '/machines';

const Machines = () => {
  const [machines, setMachines] = useState([]);
  const [formData, setFormData] = useState({ name: '', type: '', status: 'Running' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const response = await api.get(API_BASE_URL).catch(() => ({ data: [] })); // Fallback
      setMachines(response.data || []);
    } catch (error) {
      console.error('Error fetching machines:', error);
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
      setFormData({ name: '', type: '', status: 'Running' });
      setEditingId(null);
      fetchMachines();
    } catch (error) {
      console.error('Error saving machine:', error);
    }
  };

  const handleEdit = (machine) => {
    setFormData({ name: machine.name, type: machine.type, status: machine.status });
    setEditingId(machine.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`${API_BASE_URL}/${id}`).catch(console.error);
        fetchMachines();
      } catch (error) {
        console.error('Error deleting machine:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">Machines</h2>
      
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Machine Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Type" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Running">Running</option>
                <option value="Idle">Idle</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-primary w-100">{editingId ? 'Update' : 'Add'} Machine</button>
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
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {machines.length > 0 ? machines.map(machine => (
                <tr key={machine.id}>
                  <td>{machine.id}</td>
                  <td>{machine.name}</td>
                  <td>{machine.type}</td>
                  <td>
                    <span className={`badge bg-${machine.status === 'Running' ? 'success' : machine.status === 'Idle' ? 'warning' : 'danger'}`}>
                      {machine.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(machine)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(machine.id)}>Delete</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="5" className="text-center py-4">No machines found (Ensure backend is running)</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Machines;
