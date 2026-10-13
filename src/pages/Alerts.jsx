import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

const API_BASE_URL = '/alerts';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get(API_BASE_URL).catch(() => ({ data: [] }));
      // Mocking some data if backend is empty for demonstration
      const data = response.data?.length > 0 ? response.data : [
        { id: 1, type: 'Critical', message: 'Machine M-04 temperature exceeding safe limits.', timestamp: '2023-10-27 10:15:00', status: 'Unresolved' },
        { id: 2, type: 'Warning', message: 'Low raw material inventory for Product A.', timestamp: '2023-10-27 09:30:00', status: 'Unresolved' },
        { id: 3, type: 'Info', message: 'Shift change completed successfully.', timestamp: '2023-10-27 08:00:00', status: 'Resolved' },
      ];
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleResolve = async (id) => {
    try {
      await api.patch(`${API_BASE_URL}/${id}`, { status: 'Resolved' }).catch(console.error);
      setAlerts(alerts.map(alert => alert.id === id ? { ...alert, status: 'Resolved' } : alert));
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'Critical': return <AlertTriangle className="text-danger me-3" size={24} />;
      case 'Warning': return <AlertTriangle className="text-warning me-3" size={24} />;
      case 'Info': return <Info className="text-info me-3" size={24} />;
      default: return <Info className="text-secondary me-3" size={24} />;
    }
  };

  return (
    <div>
      <h2 className="mb-4">AI Monitoring & Alerts</h2>
      
      <div className="row">
        <div className="col-12">
          {alerts.length > 0 ? alerts.map(alert => (
            <div key={alert.id} className={`card shadow-sm border-0 mb-3 border-start border-4 ${
              alert.type === 'Critical' ? 'border-danger' : 
              alert.type === 'Warning' ? 'border-warning' : 'border-info'
            }`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  {getAlertIcon(alert.type)}
                  <div>
                    <h6 className="mb-1">{alert.message}</h6>
                    <small className="text-muted">{alert.timestamp}</small>
                  </div>
                </div>
                <div>
                  {alert.status === 'Resolved' ? (
                    <span className="badge bg-success d-flex align-items-center px-3 py-2">
                      <CheckCircle size={16} className="me-1" /> Resolved
                    </span>
                  ) : (
                    <button className="btn btn-sm btn-outline-success" onClick={() => handleResolve(alert.id)}>
                      Mark as Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="alert alert-info">No alerts found. Systems are normal.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
