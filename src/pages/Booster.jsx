import React, { useState, useEffect } from 'react';
import {
  Sparkles, Target, AlertTriangle, CheckCircle2, TrendingUp,
  BookOpen, Sliders, ArrowRight, ShieldAlert, Award, Clock
} from 'lucide-react';
import api from '../services/api';

const Booster = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Configurable thresholds
  const [criticalThreshold, setCriticalThreshold] = useState(40);
  const [improvementThreshold, setImprovementThreshold] = useState(60);
  const [goodThreshold, setGoodThreshold] = useState(80);

  // Completed study action items tracker
  const [completedActions, setCompletedActions] = useState({});

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/marks');
      setMarks(res.data || []);
    } catch (e) {
      console.warn('Could not load marks for booster:', e);
    } finally {
      setLoading(false);
    }
  };

  // Group marks by subject and calculate aggregated subject score
  const subjectMap = {};
  marks.forEach((m) => {
    if (!subjectMap[m.subject]) {
      subjectMap[m.subject] = { subject: m.subject, obtained: 0, max: 0, count: 0, assessments: [] };
    }
    subjectMap[m.subject].obtained += m.obtainedMarks || 0;
    subjectMap[m.subject].max += m.maxMarks || 0;
    subjectMap[m.subject].count += 1;
    subjectMap[m.subject].assessments.push(m);
  });

  const subjectList = Object.values(subjectMap).map((s) => {
    const percentage = s.max > 0 ? (s.obtained / s.max) * 100 : 0;
    return {
      ...s,
      percentage: Math.round(percentage * 100) / 100
    };
  });

  // Prioritize weakest subjects first!
  subjectList.sort((a, b) => a.percentage - b.percentage);

  // Categorize subjects based on configurable thresholds
  const getSubjectTier = (pct) => {
    if (pct < criticalThreshold) {
      return {
        level: 'Critical Attention Needed',
        range: `< ${criticalThreshold}%`,
        color: '#ef4444',
        badgeClass: 'bg-danger-subtle text-danger border-danger',
        primaryAdvice: 'Immediate fundamentals triage and urgent revision required.',
        actionSteps: [
          'Schedule an urgent 1-on-1 concept clarification with your professor/TA.',
          'Identify the bottom 3 core concepts where questions were missed and rewrite notes.',
          'Solve 5 fundamental level textbook exercise questions daily without looking at solutions.',
          'Redo previously failed assessment question papers under open-book conditions first.'
        ]
      };
    } else if (pct < improvementThreshold) {
      return {
        level: 'Needs Targeted Improvement',
        range: `${criticalThreshold}% - ${improvementThreshold - 1}%`,
        color: '#f59e0b',
        badgeClass: 'bg-warning-subtle text-warning border-warning',
        primaryAdvice: 'Practise questions and revise weak sub-topics consistently.',
        actionSteps: [
          'Create a 30-minute flashcard session for key formulas and definitions.',
          'Solve medium-difficulty problems from past 3 years university question papers.',
          'Take weekly timed 20-minute mini-quizzes to improve exam pacing and accuracy.',
          'Review error log after each practice session to eliminate recurring conceptual slips.'
        ]
      };
    } else if (pct < goodThreshold) {
      return {
        level: 'Good Standing',
        range: `${improvementThreshold}% - ${goodThreshold - 1}%`,
        color: '#2563eb',
        badgeClass: 'bg-primary-subtle text-primary border-primary',
        primaryAdvice: 'Strengthen weak areas and solve previous competitive/exam questions.',
        actionSteps: [
          'Analyze where the remaining 20-30% marks were lost (presentation, edge cases, speed).',
          'Practice full-length past papers strictly within official examination time limits.',
          'Deepen conceptual grasp by reviewing edge cases and advanced applications.',
          'Form or join a study group to discuss contentious high-yield questions.'
        ]
      };
    } else {
      return {
        level: 'Exemplary Mastery',
        range: `&ge; ${goodThreshold}%`,
        color: '#10b981',
        badgeClass: 'bg-success-subtle text-success border-success',
        primaryAdvice: 'Advanced practice, peer tutoring, and sustained revision.',
        actionSteps: [
          'Challenge yourself with higher-level questions (GATE, competitive or Olympiad level).',
          'Mentor peers on topics you excel at — teaching cements mastery.',
          'Conduct periodic spaced-repetition reviews (every 14 days) to retain long-term recall.'
        ]
      };
    }
  };

  const toggleAction = (key) => {
    setCompletedActions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="container-fluid py-4 px-md-4">
      {/* Banner */}
      <div
        className="card border-0 mb-4 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e293b 100%)',
          borderRadius: '16px',
          color: '#ffffff'
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 mb-2">
                <Sparkles size={16} color="#fbbf24" />
                <span className="small fw-semibold text-warning">Rule-Based Performance Booster</span>
              </div>
              <h2 className="fw-bold mb-1">Personalized Academic Action Roadmaps</h2>
              <p className="text-light opacity-75 small mb-0">
                Actionable study strategies generated dynamically from your lowest-scoring subjects to ensure targeted grade elevation.
              </p>
            </div>
            <div className="text-end">
              <span className="badge bg-light text-dark px-3 py-2 fs-6">
                <strong>{subjectList.length}</strong> Analyzed Subjects
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Threshold Configurator */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <Sliders size={20} className="text-primary" />
          <h5 className="fw-bold mb-0">Configurable Booster Thresholds</h5>
        </div>
        <p className="text-muted small mb-3">
          Adjust the benchmark percentages below to re-tune performance tier classification to your university grading guidelines:
        </p>

        <div className="row g-3">
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold text-danger">
              Critical Threshold (&lt; {criticalThreshold}%)
            </label>
            <input
              type="range"
              className="form-range"
              min="30"
              max="50"
              value={criticalThreshold}
              onChange={(e) => setCriticalThreshold(parseInt(e.target.value))}
            />
            <div className="d-flex justify-content-between small text-muted">
              <span>30%</span>
              <span className="fw-bold text-danger">{criticalThreshold}%</span>
              <span>50%</span>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold text-warning">
              Target Improvement Threshold ({criticalThreshold}% - {improvementThreshold}%)
            </label>
            <input
              type="range"
              className="form-range"
              min={criticalThreshold + 5}
              max="75"
              value={improvementThreshold}
              onChange={(e) => setImprovementThreshold(parseInt(e.target.value))}
            />
            <div className="d-flex justify-content-between small text-muted">
              <span>{criticalThreshold + 5}%</span>
              <span className="fw-bold text-warning">{improvementThreshold}%</span>
              <span>75%</span>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold text-success">
              Exemplary Distinction Threshold (&ge; {goodThreshold}%)
            </label>
            <input
              type="range"
              className="form-range"
              min={improvementThreshold + 5}
              max="95"
              value={goodThreshold}
              onChange={(e) => setGoodThreshold(parseInt(e.target.value))}
            />
            <div className="d-flex justify-content-between small text-muted">
              <span>{improvementThreshold + 5}%</span>
              <span className="fw-bold text-success">{goodThreshold}%</span>
              <span>95%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prioritized Subject Cards (Weakest First!) */}
      <h5 className="fw-bold text-dark mb-3">
        Prioritized Subject Interventions <span className="text-muted fs-6 fw-normal">(Weakest First)</span>
      </h5>

      {loading ? (
        <div className="p-5 text-center text-muted">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : subjectList.length === 0 ? (
        <div className="card p-5 text-center text-muted border-0 shadow-sm rounded-4">
          <h5>No marks recorded yet.</h5>
          <p className="small">Add assessment marks in Marks Management to unlock custom recommendations.</p>
        </div>
      ) : (
        <div className="row g-4">
          {subjectList.map((s, idx) => {
            const tier = getSubjectTier(s.percentage);
            return (
              <div className="col-12 col-xl-6" key={s.subject}>
                <div
                  className="card border-0 shadow-sm rounded-4 h-100 bg-white"
                  style={{ borderLeft: `6px solid ${tier.color} !important`, overflow: 'hidden' }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h4 className="fw-bold mb-0 text-dark">{s.subject}</h4>
                          {idx === 0 && (
                            <span className="badge bg-danger text-white small px-2 py-1">
                              Top Priority
                            </span>
                          )}
                        </div>
                        <span className="text-muted small">
                          Based on {s.count} evaluation{s.count > 1 ? 's' : ''} ({s.obtained}/{s.max} marks)
                        </span>
                      </div>
                      <div className="text-end">
                        <h3 className="fw-bold mb-0" style={{ color: tier.color }}>
                          {s.percentage.toFixed(1)}%
                        </h3>
                        <span className={`badge border ${tier.badgeClass}`}>
                          {tier.level}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress mb-3" style={{ height: '8px' }}>
                      <div
                        className="progress-bar"
                        style={{ width: `${Math.min(s.percentage, 100)}%`, backgroundColor: tier.color }}
                      ></div>
                    </div>

                    {/* Primary Strategy Advisory */}
                    <div
                      className="p-3 rounded-3 mb-3"
                      style={{ background: '#f8fafc', borderLeft: `3px solid ${tier.color}` }}
                    >
                      <div className="fw-semibold text-dark small mb-1">Target Strategy:</div>
                      <div className="text-secondary small">{tier.primaryAdvice}</div>
                    </div>

                    {/* Actionable Step-by-Step Revision Checklist */}
                    <div className="mb-2">
                      <span className="small fw-bold text-dark text-uppercase d-block mb-2">
                        Action Plan Checklist
                      </span>
                      <div className="d-flex flex-column gap-2">
                        {tier.actionSteps.map((step, sIdx) => {
                          const key = `${s.subject}-${sIdx}`;
                          const isDone = !!completedActions[key];
                          return (
                            <div
                              key={sIdx}
                              onClick={() => toggleAction(key)}
                              className="d-flex align-items-start gap-2 p-2 rounded-2 cursor-pointer"
                              style={{
                                background: isDone ? '#f0fdf4' : '#ffffff',
                                border: `1px solid ${isDone ? '#bbf7d0' : '#e2e8f0'}`,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div className="mt-1">
                                {isDone ? (
                                  <CheckCircle2 size={16} color="#16a34a" />
                                ) : (
                                  <div
                                    style={{
                                      width: '16px',
                                      height: '16px',
                                      borderRadius: '4px',
                                      border: '1.5px solid #94a3b8'
                                    }}
                                  ></div>
                                )}
                              </div>
                              <span
                                className="small"
                                style={{
                                  color: isDone ? '#166534' : '#334155',
                                  textDecoration: isDone ? 'line-through' : 'none'
                                }}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Booster;
