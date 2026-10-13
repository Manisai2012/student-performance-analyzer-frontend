import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, ReferenceLine
} from 'recharts';
import {
  GraduationCap, Award, TrendingUp, AlertTriangle, CheckCircle,
  FileSpreadsheet, Plus, BookOpen, Layers, Target, ArrowUpRight, ArrowDownRight,
  Sparkles, RefreshCw
} from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemoFallback, setIsDemoFallback] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [recentMarks, setRecentMarks] = useState([]);

  // Mock sample fallback if backend is unavailable
  const sampleFallbackData = {
    studentName: 'Alex Johnson',
    studentId: 'STU-1024',
    branch: 'Computer Science & Engineering',
    semester: 'Semester 5',
    totalAssessments: 7,
    totalSubjects: 6,
    totalObtainedMarks: 318.0,
    totalMaxMarks: 420.0,
    overallPercentage: 75.71,
    averageMarks: 45.43,
    passFailStatus: 'PASS',
    strongestSubject: { name: 'Discrete Mathematics', percentage: 92.0 },
    weakestSubject: { name: 'Operating Systems', percentage: 34.62 },
    subjectWisePerformance: [
      { subject: 'Operating Systems', percentage: 34.62, obtainedMarks: 45, maxMarks: 130, status: 'FAIL' },
      { subject: 'Computer Networks', percentage: 65.0, obtainedMarks: 13, maxMarks: 20, status: 'PASS' },
      { subject: 'Database Systems', percentage: 74.0, obtainedMarks: 74, maxMarks: 100, status: 'PASS' },
      { subject: 'Software Eng.', percentage: 84.0, obtainedMarks: 42, maxMarks: 50, status: 'PASS' },
      { subject: 'Data Structures', percentage: 88.0, obtainedMarks: 88, maxMarks: 100, status: 'PASS' },
      { subject: 'Discrete Math', percentage: 92.0, obtainedMarks: 46, maxMarks: 50, status: 'PASS' },
    ],
    trendPerformance: [
      { date: '2026-08-15', subject: 'Data Structures', assessmentType: 'Midterm Exam', percentage: 88.0 },
      { date: '2026-08-20', subject: 'Database Systems', assessmentType: 'Midterm Exam', percentage: 74.0 },
      { date: '2026-09-02', subject: 'Computer Networks', assessmentType: 'Quiz 1', percentage: 65.0 },
      { date: '2026-09-10', subject: 'Operating Systems', assessmentType: 'Midterm Exam', percentage: 34.0 },
      { date: '2026-09-18', subject: 'Discrete Math', assessmentType: 'Unit Test 1', percentage: 92.0 },
      { date: '2026-09-25', subject: 'Software Eng.', assessmentType: 'Project Review', percentage: 84.0 },
      { date: '2026-10-05', subject: 'Operating Systems', assessmentType: 'Lab Assignment', percentage: 36.67 }
    ],
    recommendations: [
      {
        subject: 'Operating Systems',
        percentage: 34.62,
        level: 'Critical Attention Needed (< 40%)',
        advice: 'Focus on fundamentals and urgent revision. Practice semaphore synchronization and deadlock analysis.',
        priority: 'HIGH',
        color: '#ef4444'
      },
      {
        subject: 'Computer Networks',
        percentage: 65.0,
        level: 'Good Standing (60% - 79%)',
        advice: 'Strengthen weak areas and solve previous exam questions on subnetting and routing protocols.',
        priority: 'MEDIUM',
        color: '#3b82f6'
      },
      {
        subject: 'Database Systems',
        percentage: 74.0,
        level: 'Good Standing (60% - 79%)',
        advice: 'Revise normalization forms (BCNF/3NF) and indexing mechanics to boost above 80%.',
        priority: 'MEDIUM',
        color: '#3b82f6'
      },
      {
        subject: 'Discrete Mathematics',
        percentage: 92.0,
        level: 'Exemplary Performance (80%+)',
        advice: 'Advanced practice and peer tutoring. Maintain problem speed with recurrence relations.',
        priority: 'LOW',
        color: '#10b981'
      }
    ]
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, marksRes] = await Promise.all([
        api.get('/marks/summary'),
        api.get('/marks')
      ]);

      if (summaryRes.data && summaryRes.data.totalAssessments > 0) {
        setSummaryData(summaryRes.data);
        setRecentMarks(marksRes.data || []);
        setIsDemoFallback(false);
      } else {
        // Fallback if database has no records yet
        setSummaryData(sampleFallbackData);
        setRecentMarks(sampleFallbackData.trendPerformance);
        setIsDemoFallback(true);
      }
    } catch (err) {
      console.warn('API error, using sample data for demonstration:', err);
      setSummaryData(sampleFallbackData);
      setRecentMarks(sampleFallbackData.trendPerformance);
      setIsDemoFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDownloadCsv = async () => {
    try {
      const res = await api.get('/marks/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `student_performance_${data.studentId || 'report'}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      // Client-side CSV fallback if backend was unavailable
      const headers = 'ID,Student Name,Subject,Assessment Type,Percentage\n';
      const rows = recentMarks.map((m, i) => `${i+1},"${data.studentName}","${m.subject}","${m.assessmentType}",${m.percentage}`).join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student_performance_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary me-3" role="status"></div>
        <span className="text-secondary fw-semibold">Loading Student Performance Dashboard...</span>
      </div>
    );
  }

  const data = summaryData || sampleFallbackData;
  const isPass = data.overallPercentage >= 40;

  return (
    <div className="container-fluid py-4 px-md-4">
      {/* Top Banner / Student Information Header */}
      <div
        className="card border-0 mb-4 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '16px',
          color: '#ffffff'
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.4)'
                }}
              >
                <GraduationCap size={32} color="#ffffff" />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h3 className="mb-0 fw-bold">{data.studentName || 'Student Profile'}</h3>
                  <span className={`badge ${isPass ? 'bg-success' : 'bg-danger'} px-2 py-1`}>
                    {data.passFailStatus || (isPass ? 'PASS' : 'FAIL')}
                  </span>
                  {isDemoFallback && (
                    <span className="badge bg-secondary" title="Loaded sample preview data">
                      Demo Mode
                    </span>
                  )}
                </div>
                <div className="text-light opacity-75 mt-1 small">
                  <strong>ID:</strong> {data.studentId || 'STU-1024'} &bull;{' '}
                  <strong>Branch:</strong> {data.branch || 'Engineering'} &bull;{' '}
                  <strong>Semester:</strong> {data.semester || 'Semester 5'}
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                onClick={handleDownloadCsv}
                className="btn btn-outline-light btn-sm d-flex align-items-center px-3 py-2 rounded-3"
              >
                <FileSpreadsheet size={16} className="me-2" />
                Export CSV
              </button>
              <button
                onClick={() => navigate('/marks')}
                className="btn btn-primary btn-sm d-flex align-items-center px-3 py-2 rounded-3"
                style={{ background: '#2563eb', border: 'none' }}
              >
                <Plus size={16} className="me-2" />
                Manage Marks
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="row g-3 mb-4">
        {/* Overall Percentage */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Overall Percentage</span>
                <h2 className="mt-2 mb-1 fw-bold text-dark">
                  {data.overallPercentage.toFixed(1)}%
                </h2>
                <span className={`badge ${isPass ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} fw-semibold`}>
                  {isPass ? 'Above Passing (40%)' : 'Below Passing'}
                </span>
              </div>
              <div className="p-2 bg-primary-subtle rounded-3 text-primary">
                <Award size={24} />
              </div>
            </div>
            <div className="progress mt-3" style={{ height: '6px' }}>
              <div
                className={`progress-bar ${data.overallPercentage >= 75 ? 'bg-success' : data.overallPercentage >= 60 ? 'bg-primary' : data.overallPercentage >= 40 ? 'bg-warning' : 'bg-danger'}`}
                style={{ width: `${Math.min(data.overallPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Total Subjects & Assessments */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Subjects & Tests</span>
                <h2 className="mt-2 mb-1 fw-bold text-dark">
                  {data.totalSubjects} <span className="text-muted fs-6 fw-normal">Subjects</span>
                </h2>
                <div className="text-muted small">
                  <strong>{data.totalAssessments}</strong> total assessments recorded
                </div>
              </div>
              <div className="p-2 bg-info-subtle rounded-3 text-info">
                <Layers size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Strongest Subject */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Strongest Subject</span>
                <h5 className="mt-2 mb-1 fw-bold text-success text-truncate" style={{ maxWidth: '180px' }}>
                  {data.strongestSubject?.name || 'N/A'}
                </h5>
                <span className="badge bg-success-subtle text-success fw-bold">
                  {data.strongestSubject?.percentage != null ? `${data.strongestSubject.percentage.toFixed(1)}% Score` : 'N/A'}
                </span>
              </div>
              <div className="p-2 bg-success-subtle rounded-3 text-success">
                <ArrowUpRight size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Weakest Subject */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-danger">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Needs Attention (Weakest)</span>
                <h5 className="mt-2 mb-1 fw-bold text-danger text-truncate" style={{ maxWidth: '180px' }}>
                  {data.weakestSubject?.name || 'N/A'}
                </h5>
                <span className="badge bg-danger-subtle text-danger fw-bold">
                  {data.weakestSubject?.percentage != null ? `${data.weakestSubject.percentage.toFixed(1)}% Score` : 'N/A'}
                </span>
              </div>
              <div className="p-2 bg-danger-subtle rounded-3 text-danger">
                <ArrowDownRight size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row: Charts */}
      <div className="row g-4 mb-4">
        {/* Subject-Wise Performance Bar Chart */}
        <div className="col-12 col-xl-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-1">Subject-Wise Performance Analysis</h5>
                <p className="text-muted small mb-0">Percentage marks obtained across registered subjects</p>
              </div>
              <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1">
                Benchmark: 40% Pass
              </span>
            </div>

            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.subjectWisePerformance || []} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="subject"
                    stroke="#64748b"
                    fontSize={11}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} unit="%" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded-3 shadow-sm" style={{ fontSize: '13px' }}>
                            <div className="fw-bold text-dark">{item.subject}</div>
                            <div className="text-primary fw-semibold mt-1">Percentage: {item.percentage}%</div>
                            {item.obtainedMarks != null && (
                              <div className="text-muted small">
                                Marks: {item.obtainedMarks} / {item.maxMarks}
                              </div>
                            )}
                            <div className={`badge ${item.percentage >= 40 ? 'bg-success' : 'bg-danger'} mt-1`}>
                              {item.percentage >= 40 ? 'PASS' : 'FAIL'}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={40} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Pass (40%)', fill: '#ef4444', fontSize: 11 }} />
                  <Bar
                    dataKey="percentage"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Assessment Performance Trend Chart */}
        <div className="col-12 col-xl-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-1">Assessment Performance Trend</h5>
                <p className="text-muted small mb-0">Score progression across exam dates</p>
              </div>
              <TrendingUp size={20} className="text-primary" />
            </div>

            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trendPerformance || []} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} angle={-20} textAnchor="end" />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} unit="%" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded-3 shadow-sm" style={{ fontSize: '13px' }}>
                            <div className="fw-bold text-dark">{item.subject}</div>
                            <div className="text-muted small">{item.assessmentType} &bull; {item.date}</div>
                            <div className="text-primary fw-bold mt-1">Score: {item.percentage}%</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={40} stroke="#ef4444" strokeDasharray="4 4" />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Booster Recommendations Section */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 bg-warning-subtle rounded-3 text-warning">
              <Sparkles size={22} color="#d97706" />
            </div>
            <div>
              <h5 className="fw-bold mb-0">Performance Booster & Study Recommendations</h5>
              <p className="text-muted small mb-0">
                Rule-based guidance automatically generated from your lowest-scoring subjects
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/booster')}
            className="btn btn-sm btn-outline-primary rounded-3"
          >
            Explore Booster Portal &rarr;
          </button>
        </div>

        <div className="row g-3">
          {(data.recommendations || []).map((rec, idx) => (
            <div className="col-12 col-md-6 col-lg-3" key={idx}>
              <div
                className="p-3 rounded-3 h-100 border"
                style={{
                  borderLeft: `5px solid ${rec.color} !important`,
                  background: '#f8fafc'
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0 text-dark text-truncate">{rec.subject}</h6>
                  <span
                    className="badge"
                    style={{
                      background: `${rec.color}20`,
                      color: rec.color,
                      fontWeight: '700'
                    }}
                  >
                    {rec.percentage != null ? `${rec.percentage.toFixed(1)}%` : ''}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: rec.color, fontWeight: '700', marginBottom: '6px' }}>
                  {rec.level}
                </div>
                <p className="text-secondary small mb-0" style={{ lineHeight: 1.5 }}>
                  {rec.advice}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Marks Table */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <div>
            <h5 className="fw-bold mb-0">Recent Assessments & Marks</h5>
            <p className="text-muted small mb-0">Verified marks records stored in database</p>
          </div>
          <button
            onClick={() => navigate('/marks')}
            className="btn btn-sm btn-primary rounded-3 px-3"
          >
            View All Records
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="border-0">Subject Name</th>
                <th className="border-0">Assessment Type</th>
                <th className="border-0">Obtained / Max</th>
                <th className="border-0">Percentage</th>
                <th className="border-0">Status</th>
                <th className="border-0">Date</th>
              </tr>
            </thead>
            <tbody>
              {(recentMarks.slice(0, 6) || []).map((m, idx) => {
                const pct = m.percentage != null ? m.percentage : (m.maxMarks ? (m.obtainedMarks / m.maxMarks) * 100 : 0);
                const pass = pct >= 40;
                return (
                  <tr key={idx}>
                    <td className="fw-semibold text-dark">{m.subject}</td>
                    <td>
                      <span className="badge bg-light text-dark border">{m.assessmentType}</span>
                    </td>
                    <td>
                      {m.obtainedMarks != null && m.maxMarks != null ? (
                        <span>
                          <strong>{m.obtainedMarks}</strong> / {m.maxMarks}
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <span className="fw-bold">{pct.toFixed(1)}%</span>
                    </td>
                    <td>
                      <span className={`badge ${pass ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        {pass ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                    <td className="text-muted small">{m.examDate || m.date || 'Recent'}</td>
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

export default Dashboard;
