import React, { useState } from 'react';
import './KPIDashboard.css';

function KPIDashboard() {
  const [kpis, setKpis] = useState([
    {
      id: 1,
      name: 'Daily Active Users',
      category: 'Engagement',
      actual: 15000,
      target: 20000,
      unit: 'users',
      trend: 'up',
    },
    {
      id: 2,
      name: 'Conversion Rate',
      category: 'Revenue',
      actual: 3.2,
      target: 4.5,
      unit: '%',
      trend: 'up',
    },
    {
      id: 3,
      name: 'Customer Retention',
      category: 'Retention',
      actual: 85,
      target: 90,
      unit: '%',
      trend: 'stable',
    },
    {
      id: 4,
      name: 'Customer Satisfaction',
      category: 'Satisfaction',
      actual: 4.2,
      target: 4.5,
      unit: '/5',
      trend: 'up',
    },
    {
      id: 5,
      name: 'Page Load Time',
      category: 'Efficiency',
      actual: 1.8,
      target: 1.5,
      unit: 's',
      trend: 'down',
    },
    {
      id: 6,
      name: 'Monthly Recurring Revenue',
      category: 'Revenue',
      actual: 125000,
      target: 150000,
      unit: '$',
      trend: 'up',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Engagement',
    actual: '',
    target: '',
    unit: '',
    trend: 'stable',
  });

  const categories = [
    'Engagement',
    'Revenue',
    'Retention',
    'Satisfaction',
    'Efficiency',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'name' || name === 'unit' ? value : parseFloat(value) || '',
    });
  };

  const handleAddKPI = () => {
    if (
      formData.name &&
      formData.actual !== '' &&
      formData.target !== '' &&
      formData.unit
    ) {
      const newKPI = {
        id: Math.max(...kpis.map((k) => k.id), 0) + 1,
        ...formData,
      };
      setKpis([...kpis, newKPI]);
      setFormData({
        name: '',
        category: 'Engagement',
        actual: '',
        target: '',
        unit: '',
        trend: 'stable',
      });
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleDeleteKPI = (id) => {
    setKpis(kpis.filter((k) => k.id !== id));
  };

  const handleUpdateKPI = (id, field, value) => {
    setKpis(
      kpis.map((k) =>
        k.id === id ? { ...k, [field]: value } : k
      )
    );
  };

  const categoryColors = {
    Engagement: '#0ea5e9',
    Revenue: '#10b981',
    Retention: '#f59e0b',
    Satisfaction: '#ec4899',
    Efficiency: '#8b5cf6',
  };

  const getProgressPercentage = (actual, target) => {
    return Math.min((actual / target) * 100, 100);
  };

  const getHealthScore = () => {
    const scores = kpis.map((kpi) => {
      const progress = getProgressPercentage(kpi.actual, kpi.target);
      return progress >= 90 ? 3 : progress >= 70 ? 2 : 1;
    });
    const average =
      scores.reduce((a, b) => a + b, 0) / Math.max(scores.length, 1);
    return average.toFixed(2);
  };

  const getCategoryMetrics = () => {
    const metrics = {};
    categories.forEach((cat) => {
      const catKPIs = kpis.filter((k) => k.category === cat);
      if (catKPIs.length > 0) {
        const avgProgress =
          catKPIs.reduce((acc, k) => acc + getProgressPercentage(k.actual, k.target), 0) /
          catKPIs.length;
        metrics[cat] = {
          count: catKPIs.length,
          avgProgress: avgProgress.toFixed(1),
        };
      }
    });
    return metrics;
  };

  const categoryMetrics = getCategoryMetrics();
  const healthScore = getHealthScore();

  return (
    <div className="kpi-container">
      <h2>📈 KPI Dashboard</h2>

      <div className="kpi-health-section">
        <div className="health-card">
          <div className="health-score">
            <div className="score-circle">
              <span className="score-value">{healthScore}</span>
              <span className="score-label">/3.0</span>
            </div>
            <div className="score-info">
              <h3>Overall Health</h3>
              <p>Product metrics performance</p>
            </div>
          </div>
        </div>

        <div className="category-overview">
          <h3>Category Overview</h3>
          <div className="categories-grid">
            {categories.map((cat) => {
              const metric = categoryMetrics[cat];
              if (!metric) return null;
              return (
                <div key={cat} className="category-item">
                  <div
                    className="category-indicator"
                    style={{ backgroundColor: categoryColors[cat] }}
                  ></div>
                  <div className="category-details">
                    <span className="category-name">{cat}</span>
                    <span className="category-progress">{metric.avgProgress}% avg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="kpi-content">
        <div className="kpi-input-section">
          <h3>Add New KPI</h3>

          <div className="form-group">
            <label>KPI Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., User Engagement Score"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Unit *</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                placeholder="e.g., users, %, $"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Current Value *</label>
              <input
                type="number"
                name="actual"
                value={formData.actual}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Target Value *</label>
              <input
                type="number"
                name="target"
                value={formData.target}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Trend *</label>
            <select name="trend" value={formData.trend} onChange={handleInputChange}>
              <option value="up">📈 Trending Up</option>
              <option value="stable">➡️ Stable</option>
              <option value="down">📉 Trending Down</option>
            </select>
          </div>

          <button className="add-button" onClick={handleAddKPI}>
            + Add KPI
          </button>
        </div>

        <div className="kpi-list-section">
          <h3>KPI Metrics</h3>

          {kpis.length === 0 ? (
            <p className="empty-message">No KPIs yet. Add one to get started!</p>
          ) : (
            <div className="kpis-list">
              {kpis
                .sort((a, b) => getProgressPercentage(b.actual, b.target) - getProgressPercentage(a.actual, a.target))
                .map((kpi) => {
                  const progress = getProgressPercentage(kpi.actual, kpi.target);
                  const isOnTrack = progress >= 70;

                  return (
                    <div key={kpi.id} className="kpi-item">
                      <div className="kpi-header">
                        <div className="kpi-title-section">
                          <h4>{kpi.name}</h4>
                          <span
                            className="kpi-category"
                            style={{ backgroundColor: categoryColors[kpi.category] }}
                          >
                            {kpi.category}
                          </span>
                        </div>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteKPI(kpi.id)}
                        >
                          ×
                        </button>
                      </div>

                      <div className="kpi-values">
                        <div className="value-display">
                          <div className="actual-value">
                            <span className="label">Current</span>
                            <div className="number">
                              {kpi.actual}
                              <span className="unit">{kpi.unit}</span>
                            </div>
                          </div>
                          <div className="target-value">
                            <span className="label">Target</span>
                            <div className="number">
                              {kpi.target}
                              <span className="unit">{kpi.unit}</span>
                            </div>
                          </div>
                          <div className="trend-indicator">
                            <span className="label">Trend</span>
                            <select
                              value={kpi.trend}
                              onChange={(e) => handleUpdateKPI(kpi.id, 'trend', e.target.value)}
                              className="trend-select"
                            >
                              <option value="up">📈 Up</option>
                              <option value="stable">➡️ Stable</option>
                              <option value="down">📉 Down</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="progress-section">
                        <div className="progress-bar-container">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${Math.min(progress, 100)}%`,
                                backgroundColor: isOnTrack ? '#10b981' : '#f59e0b',
                              }}
                            ></div>
                          </div>
                          <span className="progress-percentage">{progress.toFixed(1)}%</span>
                        </div>
                        <span className={`progress-status ${isOnTrack ? 'on-track' : 'at-risk'}`}>
                          {isOnTrack ? '✓ On Track' : '⚠ Needs Attention'}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KPIDashboard;
