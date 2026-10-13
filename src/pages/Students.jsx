import React, { useState, useEffect } from 'react';
import { Users, Search, GraduationCap, Award, ShieldCheck, Download, Trash2 } from 'lucide-react';
import api from '../services/api';

const Students = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get('/marks');
      setMarks(res.data || []);
    } catch (e) {
      console.warn('Error fetching all student marks:', e);
    } finally {
      setLoading(false);
    }
  };

  // Group by student
  const studentMap = {};
  marks.forEach((m) => {
    const id = m.studentId || 'UNKNOWN';
    if (!studentMap[id]) {
      studentMap[id] = {
        studentId: id,
        studentName: m.studentName || 'Student',
        branch: m.branch || 'General',
        semester: m.semester || 'N/A',
        username: m.username,
        marks: [],
        totalObtained: 0,
        totalMax: 0
      };
    }
    studentMap[id].marks.push(m);
    studentMap[id].totalObtained += m.obtainedMarks || 0;
    studentMap[id].totalMax += m.maxMarks || 0;
  });

  const studentList = Object.values(studentMap).map((s) => {
    const pct = s.totalMax > 0 ? (s.totalObtained / s.totalMax) * 100 : 0;
    return {
      ...s,
      percentage: Math.round(pct * 100) / 100,
      status: pct >= 40 ? 'PASS' : 'FAIL'
    };
  });

  const filteredStudents = studentList.filter((s) =>
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedRecord = selectedStudentId ? studentMap[selectedStudentId] : null;

  return (
    <div className="container-fluid py-4 px-md-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h2 className="fw-bold mb-0 text-dark">Student Academic Registry</h2>
            <span className="badge bg-warning text-dark fw-bold">Admin Portal</span>
          </div>
          <p className="text-muted small mb-0">
            Administrative overview of student cohorts, aggregate percentages, and performance records
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <Search size={16} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Search by student name, ID or branch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-4">
        {/* Student Cards / Table */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            <div className="card-header bg-white border-bottom p-3">
              <h5 className="fw-bold mb-0 text-dark">Enrolled Students ({filteredStudents.length})</h5>
            </div>
            {loading ? (
              <div className="p-4 text-center">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-4 text-center text-muted">No students matching criteria</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-3">Student Name</th>
                      <th>Student ID</th>
                      <th>Branch</th>
                      <th>Aggregate %</th>
                      <th>Status</th>
                      <th className="text-end pe-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s) => (
                      <tr
                        key={s.studentId}
                        style={{ cursor: 'pointer' }}
                        className={selectedStudentId === s.studentId ? 'table-primary' : ''}
                        onClick={() => setSelectedStudentId(s.studentId)}
                      >
                        <td className="ps-3 fw-semibold text-dark">{s.studentName}</td>
                        <td><code>{s.studentId}</code></td>
                        <td className="small text-muted">{s.branch}</td>
                        <td className="fw-bold">{s.percentage}%</td>
                        <td>
                          <span className={`badge ${s.status === 'PASS' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="text-end pe-3">
                          <button
                            className="btn btn-sm btn-outline-primary rounded-2 py-1 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudentId(s.studentId);
                            }}
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Selected Student Marksheet Detail */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
            {selectedRecord ? (
              <div>
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">{selectedRecord.studentName}</h5>
                    <span className="text-muted small">
                      {selectedRecord.studentId} &bull; {selectedRecord.branch} ({selectedRecord.semester})
                    </span>
                  </div>
                  <span
                    className={`badge ${
                      (selectedRecord.totalMax > 0 && (selectedRecord.totalObtained / selectedRecord.totalMax) * 100 >= 40)
                        ? 'bg-success'
                        : 'bg-danger'
                    } px-2 py-1`}
                  >
                    {((selectedRecord.totalObtained / selectedRecord.totalMax) * 100).toFixed(1)}% Score
                  </span>
                </div>

                <h6 className="fw-bold text-dark mb-2">Recorded Assessments</h6>
                <div className="d-flex flex-column gap-2" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                  {selectedRecord.marks.map((m) => {
                    const pct = m.percentage != null ? m.percentage : ((m.obtainedMarks / m.maxMarks) * 100);
                    return (
                      <div key={m.id} className="p-3 bg-light rounded-3 border">
                        <div className="d-flex justify-content-between align-items-center">
                          <strong className="text-dark">{m.subject}</strong>
                          <span className={`badge ${pct >= 40 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                            {pct.toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-muted small mt-1">
                          {m.assessmentType} &bull; {m.obtainedMarks} / {m.maxMarks} marks &bull; {m.examDate}
                        </div>
                        {m.remarks && <div className="text-secondary small mt-1 fst-italic">"{m.remarks}"</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted p-5 my-auto">
                <GraduationCap size={48} className="text-secondary opacity-50 mb-3" />
                <h5 className="fw-semibold text-dark">No Student Selected</h5>
                <p className="small">Click "Inspect" on any student in the registry table to view their itemized evaluations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
