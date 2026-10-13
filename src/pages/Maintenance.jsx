import React, { useState, useEffect } from 'react';
import api from '../services/api';

const API_BASE_URL = '/maintenance';

const Maintenance = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ machineId: '', description: '', scheduledDate: '', status: 'Scheduled' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get(API_BASE_URL).catch(() => ({ data: [] }));
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching maintenance tasks:', error);
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
      setFormData({ machineId: '', description: '', scheduledDate: '', status: 'Scheduled' });
      setEditingId(null);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleEdit = (task) => {
    setFormData({ machineId: task.machineId, description: task.description, scheduledDate: task.scheduledDate, status: task.status });
    setEditingId(task.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`${API_BASE_URL}/${id}`).catch(console.error);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">Maintenance</h2>
      
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-2">
              <input type="text" className="form-control" placeholder="Machine ID" value={formData.machineId} onChange={e => setFormData({...formData, machineId: e.target.value})} required />
            </div>
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </div>
            <div className="col-md-2">
              <input type="date" className="form-control" value={formData.scheduledDate} onChange={e => setFormData({...formData, scheduledDate: e.target.value})} required />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
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
                <th>Machine ID</th>
                <th>Description</th>
                <th>Scheduled Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? tasks.map(task => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.machineId}</td>
                  <td>{task.description}</td>
                  <td>{task.scheduledDate}</td>
                  <td>
                    <span className={`badge bg-${task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'info' : 'secondary'}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(task)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="text-center py-4">No maintenance tasks found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
