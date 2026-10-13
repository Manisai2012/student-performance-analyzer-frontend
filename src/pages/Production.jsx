import React, { useState, useEffect } from 'react';
import api from '../services/api';

const API_BASE_URL = '/production';

const Production = () => {
  const [productionData, setProductionData] = useState([]);
  const [formData, setFormData] = useState({ date: '', output: '', machineId: '', shift: 'Morning' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProductionData();
  }, []);

  const fetchProductionData = async () => {
    try {
      const response = await api.get(API_BASE_URL).catch(() => ({ data: [] }));
      setProductionData(response.data || []);
    } catch (error) {
      console.error('Error fetching production data:', error);
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
      setFormData({ date: '', output: '', machineId: '', shift: 'Morning' });
      setEditingId(null);
      fetchProductionData();
    } catch (error) {
      console.error('Error saving production record:', error);
    }
  };

  const handleEdit = (record) => {
    setFormData({ date: record.date, output: record.output, machineId: record.machineId, shift: record.shift });
    setEditingId(record.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`${API_BASE_URL}/${id}`).catch(console.error);
        fetchProductionData();
      } catch (error) {
        console.error('Error deleting production record:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">Production Logs</h2>
      
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <input type="date" className="form-control" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div className="col-md-2">
              <input type="number" className="form-control" placeholder="Output" value={formData.output} onChange={e => setFormData({...formData, output: e.target.value})} required />
            </div>
            <div className="col-md-2">
              <input type="text" className="form-control" placeholder="Machine ID" value={formData.machineId} onChange={e => setFormData({...formData, machineId: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})}>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
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
                <th>Date</th>
                <th>Output Units</th>
                <th>Machine ID</th>
                <th>Shift</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productionData.length > 0 ? productionData.map(record => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.date}</td>
                  <td>{record.output}</td>
                  <td>{record.machineId}</td>
                  <td>{record.shift}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(record)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(record.id)}>Delete</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="text-center py-4">No production records found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Production;
