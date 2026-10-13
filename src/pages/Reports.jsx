import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet, Download, Printer, CheckCircle, Award, BookOpen, Layers
} from 'lucide-react';
import api from '../services/api';

const Reports = () => {
  const [marks, setMarks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, sRes] = await Promise.all([
        api.get('/marks'),
        api.get('/marks/summary')
      ]);
      setMarks(mRes.data || []);
      setSummary(sRes.data || null);
    } catch (e) {
      console.warn('Reports load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = async () => {
    try {
      const res = await api.get('/marks/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student_performance_analyzer_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      // Fallback CSV builder
      const headers = 'ID,Student Name,Student ID,Branch,Semester,Subject,Assessment Type,Obtained Marks,Max Marks,Percentage (%),Date,Status\n';
      const rows = marks.map((m, i) => {
        const pct = m.percentage != null ? m.percentage : ((m.obtainedMarks / m.maxMarks) * 100);
        return `${m.id || i+1},"${m.studentName || 'Alex Johnson'}","${m.studentId || 'STU-1024'}","${m.branch || 'CSE'}","${m.semester || 'Sem 5'}","${m.subject}","${m.assessmentType}",${m.obtainedMarks},${m.maxMarks},${pct.toFixed(2)},"${m.examDate || ''}",${pct >= 40 ? 'PASS' : 'FAIL'}`;
      }).join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student_performance_analyzer_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container-fluid py-4 px-md-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 no-print">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Academic Reports & Transcripts</h2>
          <p className="text-muted small mb-0">
            Export comprehensive evaluations or generate official grade summary reports
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={handlePrint}
            className="btn btn-outline-secondary d-flex align-items-center rounded-3 px-3"
          >
            <Printer size={16} className="me-2" />
            Print Transcript
          </button>
          <button
            onClick={handleDownloadCsv}
            className="btn btn-primary d-flex align-items-center rounded-3 px-3 shadow-sm"
            style={{ background: '#2563eb', border: 'none' }}
          >
            <Download size={16} className="me-2" />
            Export Official CSV
          </button>
        </div>
      </div>

      {/* Grade Card Summary */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-3">
          <div>
            <h4 className="fw-bold text-dark mb-1">
              {summary?.studentName || 'Alex Johnson'}
            </h4>
            <div className="text-muted small">
              <strong>Student ID:</strong> {summary?.studentId || 'STU-1024'} &bull;{' '}
              <strong>Department:</strong> {summary?.branch || 'Computer Science & Engineering'} &bull;{' '}
              <strong>Semester:</strong> {summary?.semester || 'Semester 5'}
            </div>
          </div>
          <div className="text-md-end mt-2 mt-md-0">
            <span
              className={`badge fs-6 px-3 py-2 ${
                (summary?.overallPercentage || 0) >= 40 ? 'bg-success' : 'bg-danger'
              }`}
            >
              Overall: {(summary?.overallPercentage || 0).toFixed(1)}% &bull;{' '}
              {(summary?.overallPercentage || 0) >= 40 ? 'PASS' : 'FAIL'}
            </span>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded-3">
              <span className="text-muted small d-block">Total Obtained</span>
              <h4 className="fw-bold text-dark mb-0">
                {summary?.totalObtainedMarks || 0} / {summary?.totalMaxMarks || 0}
              </h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded-3">
              <span className="text-muted small d-block">Overall Percentage</span>
              <h4 className="fw-bold text-primary mb-0">
                {(summary?.overallPercentage || 0).toFixed(2)}%
              </h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded-3">
              <span className="text-muted small d-block">Average Marks</span>
              <h4 className="fw-bold text-dark mb-0">
                {(summary?.averageMarks || 0).toFixed(2)}
              </h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded-3">
              <span className="text-muted small d-block">Total Assessments</span>
              <h4 className="fw-bold text-dark mb-0">
                {summary?.totalAssessments || marks.length}
              </h4>
            </div>
          </div>
        </div>

        {/* Detailed Marksheet Table */}
        <h5 className="fw-bold text-dark mb-3">Itemized Assessment Records</h5>
        <div className="table-responsive">
          <table className="table table-bordered align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Subject Name</th>
                <th>Assessment Type</th>
                <th>Obtained Marks</th>
                <th>Maximum Marks</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m, idx) => {
                const pct = m.percentage != null ? m.percentage : ((m.obtainedMarks / m.maxMarks) * 100);
                const pass = pct >= 40;
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{m.subject}</td>
                    <td>{m.assessmentType}</td>
                    <td>{m.obtainedMarks}</td>
                    <td>{m.maxMarks}</td>
                    <td className="fw-bold">{pct.toFixed(2)}%</td>
                    <td>
                      <span className={`badge ${pass ? 'bg-success' : 'bg-danger'}`}>
                        {pass ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                    <td>{m.examDate || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
