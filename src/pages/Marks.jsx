import React, { useState, useEffect } from 'react';
import {
  GraduationCap, Plus, Edit2, Trash2, Search, Filter, Download,
  CheckCircle, AlertCircle, X, Check, Save, ArrowUpDown
} from 'lucide-react';
import api from '../services/api';

const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMark, setSelectedMark] = useState(null);

  // Form State
  const defaultFormData = {
    studentName: 'Alex Johnson',
    studentId: 'STU-1024',
    branch: 'Computer Science',
    semester: 'Semester 5',
    subject: '',
    assessmentType: 'Midterm Exam',
    obtainedMarks: '',
    maxMarks: '100',
    examDate: new Date().toISOString().split('T')[0],
    remarks: ''
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchMarks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/marks');
      setMarks(res.data || []);
    } catch (err) {
      console.error('Error fetching marks:', err);
      showNotification('Failed to load marks from server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Populate default student info from logged-in user if available
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        defaultFormData.studentName = u.fullName || u.username;
      } catch (e) {}
    }
    fetchMarks();
  }, []);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Real-time calculation of percentage
  const calculatePercentage = (obtained, max) => {
    const obt = parseFloat(obtained);
    const m = parseFloat(max);
    if (!isNaN(obt) && !isNaN(m) && m > 0) {
      return ((obt / m) * 100).toFixed(2);
    }
    return null;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.studentName.trim()) errors.studentName = 'Student name is required.';
    if (!formData.studentId.trim()) errors.studentId = 'Student ID is required.';
    if (!formData.subject.trim()) errors.subject = 'Subject name is required.';
    if (!formData.assessmentType.trim()) errors.assessmentType = 'Assessment type is required.';

    const obt = parseFloat(formData.obtainedMarks);
    const max = parseFloat(formData.maxMarks);

    if (isNaN(max) || max <= 0) {
      errors.maxMarks = 'Max marks must be greater than 0.';
    }
    if (isNaN(obt) || obt < 0) {
      errors.obtainedMarks = 'Obtained marks cannot be negative.';
    } else if (!isNaN(max) && obt > max) {
      errors.obtainedMarks = 'Obtained marks cannot exceed maximum marks.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setFormData(defaultFormData);
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleOpenEdit = (m) => {
    setSelectedMark(m);
    setFormData({
      studentName: m.studentName,
      studentId: m.studentId,
      branch: m.branch || 'Computer Science',
      semester: m.semester || 'Semester 5',
      subject: m.subject,
      assessmentType: m.assessmentType,
      obtainedMarks: m.obtainedMarks.toString(),
      maxMarks: m.maxMarks.toString(),
      examDate: m.examDate || new Date().toISOString().split('T')[0],
      remarks: m.remarks || ''
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleOpenDelete = (m) => {
    setSelectedMark(m);
    setShowDeleteModal(true);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        ...formData,
        obtainedMarks: parseFloat(formData.obtainedMarks),
        maxMarks: parseFloat(formData.maxMarks)
      };
      await api.post('/marks', payload);
      showNotification('Marks recorded successfully!');
      setShowAddModal(false);
      fetchMarks();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.obtainedMarks || 'Failed to save marks.';
      showNotification(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        ...formData,
        obtainedMarks: parseFloat(formData.obtainedMarks),
        maxMarks: parseFloat(formData.maxMarks)
      };
      await api.put(`/marks/${selectedMark.id}`, payload);
      showNotification('Marks updated successfully!');
      setShowEditModal(false);
      fetchMarks();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.obtainedMarks || 'Failed to update marks.';
      showNotification(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedMark) return;
    setSaving(true);
    try {
      await api.delete(`/marks/${selectedMark.id}`);
      showNotification('Marks record deleted successfully!');
      setShowDeleteModal(false);
      fetchMarks();
    } catch (err) {
      showNotification('Failed to delete marks record.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const res = await api.get('/marks/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student_marks_records.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      showNotification('Could not export CSV from server.', 'error');
    }
  };

  // Distinct subjects for filter
  const distinctSubjects = Array.from(new Set(marks.map(m => m.subject))).filter(Boolean);

  // Filtered marks
  const filteredMarks = marks.filter((m) => {
    const matchesSearch =
      m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.assessmentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.studentName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = subjectFilter === 'ALL' || m.subject === subjectFilter;

    const pct = m.percentage != null ? m.percentage : ((m.obtainedMarks / m.maxMarks) * 100);
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PASS' && pct >= 40) ||
      (statusFilter === 'FAIL' && pct < 40);

    return matchesSearch && matchesSubject && matchesStatus;
  });

  const previewPct = calculatePercentage(formData.obtainedMarks, formData.maxMarks);

  return (
    <div className="container-fluid py-4 px-md-4">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`alert ${notification.type === 'error' ? 'alert-danger' : 'alert-success'} alert-dismissible fade show position-fixed top-0 end-0 m-4 shadow-lg`}
          style={{ zIndex: 9999, minWidth: '300px' }}
          role="alert"
        >
          {notification.msg}
          <button type="button" className="btn-close" onClick={() => setNotification(null)}></button>
        </div>
      )}

      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Marks Management</h2>
          <p className="text-muted small mb-0">
            Add, update, calculate, and manage individual examination marks
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={handleExportCsv}
            className="btn btn-outline-secondary d-flex align-items-center rounded-3 px-3"
          >
            <Download size={16} className="me-2" />
            Download CSV
          </button>
          <button
            onClick={handleOpenAdd}
            className="btn btn-primary d-flex align-items-center rounded-3 px-3 shadow-sm"
            style={{ background: '#2563eb', border: 'none' }}
          >
            <Plus size={18} className="me-2" />
            Add New Marks
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by subject or assessment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="ALL">All Subjects</option>
              {distinctSubjects.map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PASS">Pass (&ge; 40%)</option>
              <option value="FAIL">Fail (&lt; 40%)</option>
            </select>
          </div>
          <div className="col-12 col-md-2 text-md-end text-muted small">
            Showing <strong>{filteredMarks.length}</strong> of <strong>{marks.length}</strong>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
        {loading ? (
          <div className="p-5 text-center text-muted">
            <div className="spinner-border text-primary mb-2"></div>
            <div>Loading marks records...</div>
          </div>
        ) : filteredMarks.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <AlertCircle size={40} className="mb-2 text-secondary opacity-50" />
            <h5 className="fw-semibold text-dark">No Marks Found</h5>
            <p className="small mb-3">No evaluation records match your search criteria or none have been added yet.</p>
            <button onClick={handleOpenAdd} className="btn btn-sm btn-primary">
              <Plus size={16} className="me-1" /> Add Your First Record
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Subject</th>
                  <th>Assessment Type</th>
                  <th>Obtained Marks</th>
                  <th>Max Marks</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Exam Date</th>
                  <th>Remarks</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMarks.map((m) => {
                  const pct = m.percentage != null ? m.percentage : ((m.obtainedMarks / m.maxMarks) * 100);
                  const pass = pct >= 40;
                  return (
                    <tr key={m.id}>
                      <td className="ps-4 fw-semibold text-dark">{m.subject}</td>
                      <td>
                        <span className="badge bg-light text-dark border">{m.assessmentType}</span>
                      </td>
                      <td className="fw-bold text-dark">{m.obtainedMarks}</td>
                      <td className="text-muted">{m.maxMarks}</td>
                      <td>
                        <span className={`fw-bold ${pass ? 'text-dark' : 'text-danger'}`}>
                          {pct.toFixed(1)}%
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${pass ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                          {pass ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                      <td className="text-muted small">{m.examDate || '-'}</td>
                      <td className="text-muted small text-truncate" style={{ maxWidth: '160px' }}>
                        {m.remarks || '-'}
                      </td>
                      <td className="text-end pe-4">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="btn btn-sm btn-outline-primary me-2 rounded-2 p-1 px-2"
                          title="Edit Marks"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(m)}
                          className="btn btn-sm btn-outline-danger rounded-2 p-1 px-2"
                          title="Delete Marks"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {showAddModal ? 'Add Assessment Marks' : 'Edit Assessment Marks'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                ></button>
              </div>

              <form onSubmit={showAddModal ? handleSaveAdd : handleSaveEdit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">Subject Name *</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.subject ? 'is-invalid' : ''}`}
                        placeholder="e.g. Operating Systems"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                      {formErrors.subject && <div className="invalid-feedback">{formErrors.subject}</div>}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">Assessment Type *</label>
                      <select
                        className="form-select"
                        value={formData.assessmentType}
                        onChange={(e) => setFormData({ ...formData, assessmentType: e.target.value })}
                      >
                        <option value="Midterm Exam">Midterm Exam</option>
                        <option value="Final Exam">Final Exam</option>
                        <option value="Quiz 1">Quiz 1</option>
                        <option value="Quiz 2">Quiz 2</option>
                        <option value="Assignment 1">Assignment 1</option>
                        <option value="Assignment 2">Assignment 2</option>
                        <option value="Lab Test">Lab Test</option>
                        <option value="Project Review">Project Review</option>
                      </select>
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-semibold">Obtained Marks *</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        className={`form-control ${formErrors.obtainedMarks ? 'is-invalid' : ''}`}
                        placeholder="e.g. 78"
                        value={formData.obtainedMarks}
                        onChange={(e) => setFormData({ ...formData, obtainedMarks: e.target.value })}
                      />
                      {formErrors.obtainedMarks && (
                        <div className="invalid-feedback">{formErrors.obtainedMarks}</div>
                      )}
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-semibold">Maximum Marks *</label>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        className={`form-control ${formErrors.maxMarks ? 'is-invalid' : ''}`}
                        placeholder="e.g. 100"
                        value={formData.maxMarks}
                        onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                      />
                      {formErrors.maxMarks && <div className="invalid-feedback">{formErrors.maxMarks}</div>}
                    </div>

                    {/* Automatic Live Percentage Preview */}
                    {previewPct !== null && (
                      <div className="col-12">
                        <div className="p-2 rounded-3 bg-light border d-flex justify-content-between align-items-center">
                          <span className="small text-muted">Calculated Percentage:</span>
                          <span
                            className={`fw-bold ${parseFloat(previewPct) >= 40 ? 'text-success' : 'text-danger'}`}
                          >
                            {previewPct}% ({parseFloat(previewPct) >= 40 ? 'PASS' : 'FAIL'})
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">Exam Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.examDate}
                        onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">Remarks / Notes</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Good performance"
                        value={formData.remarks}
                        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-3"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary rounded-3 px-4"
                    style={{ background: '#2563eb', border: 'none' }}
                  >
                    {saving ? 'Saving...' : showAddModal ? 'Save Marks' : 'Update Marks'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMark && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg p-3">
              <div className="modal-body text-center p-4">
                <div className="p-3 bg-danger-subtle rounded-circle text-danger d-inline-flex mb-3">
                  <Trash2 size={32} />
                </div>
                <h5 className="fw-bold mb-2">Delete Marks Record?</h5>
                <p className="text-muted small mb-4">
                  Are you sure you want to delete the record for <strong>{selectedMark.subject}</strong> ({selectedMark.assessmentType})? This action cannot be undone.
                </p>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    type="button"
                    className="btn btn-light px-4 rounded-3"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    className="btn btn-danger px-4 rounded-3"
                    onClick={handleConfirmDelete}
                  >
                    {saving ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marks;
