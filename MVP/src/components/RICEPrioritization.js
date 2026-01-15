import React, { useState } from 'react';
import './RICEPrioritization.css';

function RICEPrioritization() {
  const [features, setFeatures] = useState([
    {
      id: 1,
      name: 'Dark Mode',
      reach: 800000,
      impact: 3,
      confidence: 80,
      effort: 5,
    },
    {
      id: 2,
      name: 'Mobile App',
      reach: 2000000,
      impact: 5,
      confidence: 60,
      effort: 100,
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    reach: '',
    impact: 3,
    confidence: 80,
    effort: '',
  });

  const calculateRICE = (reach, impact, confidence, effort) => {
    if (!effort || effort === 0) return 0;
    return (reach * impact * (confidence / 100)) / effort;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'name' ? value : parseFloat(value) || '',
    });
  };

  const handleAddFeature = () => {
    if (
      formData.name &&
      formData.reach &&
      formData.effort
    ) {
      const newFeature = {
        id: Math.max(...features.map((f) => f.id), 0) + 1,
        name: formData.name,
        reach: formData.reach,
        impact: formData.impact,
        confidence: formData.confidence,
        effort: formData.effort,
      };
      setFeatures([...features, newFeature].sort(
        (a, b) =>
          calculateRICE(b.reach, b.impact, b.confidence, b.effort) -
          calculateRICE(a.reach, a.impact, a.confidence, a.effort)
      ));
      setFormData({
        name: '',
        reach: '',
        impact: 3,
        confidence: 80,
        effort: '',
      });
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleDeleteFeature = (id) => {
    setFeatures(features.filter((f) => f.id !== id));
  };

  const sortedFeatures = [...features].sort(
    (a, b) =>
      calculateRICE(b.reach, b.impact, b.confidence, b.effort) -
      calculateRICE(a.reach, a.impact, a.confidence, a.effort)
  );

  const maxRICE = Math.max(
    ...sortedFeatures.map((f) =>
      calculateRICE(f.reach, f.impact, f.confidence, f.effort)
    ),
    1
  );

  return (
    <div className="rice-container">
      <h2>🎯 RICE Prioritization Framework</h2>

      <div className="rice-content">
        <div className="rice-input-section">
          <h3>Add New Feature</h3>
          <div className="form-group">
            <label>Feature Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Push Notifications"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Reach (Users) *</label>
              <input
                type="number"
                name="reach"
                value={formData.reach}
                onChange={handleInputChange}
                placeholder="Number of users"
              />
            </div>

            <div className="form-group">
              <label>Impact (1-5) *</label>
              <select name="impact" value={formData.impact} onChange={handleInputChange}>
                <option value={1}>1 - Minimal</option>
                <option value={2}>2 - Low</option>
                <option value={3}>3 - Medium</option>
                <option value={4}>4 - High</option>
                <option value={5}>5 - Massive</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Confidence (%) *</label>
              <input
                type="number"
                name="confidence"
                value={formData.confidence}
                onChange={handleInputChange}
                min="0"
                max="100"
                placeholder="0-100"
              />
            </div>

            <div className="form-group">
              <label>Effort (Person-months) *</label>
              <input
                type="number"
                name="effort"
                value={formData.effort}
                onChange={handleInputChange}
                placeholder="Months needed"
              />
            </div>
          </div>

          <button className="add-button" onClick={handleAddFeature}>
            + Add Feature
          </button>
        </div>

        <div className="rice-results-section">
          <h3>Prioritized Features</h3>
          <div className="rice-legend">
            <p>RICE Score = (Reach × Impact × Confidence/100) / Effort</p>
          </div>

          {sortedFeatures.length === 0 ? (
            <p className="empty-message">No features yet. Add one to get started!</p>
          ) : (
            <div className="features-list">
              {sortedFeatures.map((feature, index) => {
                const riceScore = calculateRICE(
                  feature.reach,
                  feature.impact,
                  feature.confidence,
                  feature.effort
                );
                const percentage = (riceScore / maxRICE) * 100;

                return (
                  <div key={feature.id} className="feature-card">
                    <div className="feature-header">
                      <div className="feature-rank">#{index + 1}</div>
                      <div className="feature-info">
                        <h4>{feature.name}</h4>
                        <p className="feature-score">
                          RICE Score: <span className="score-value">{riceScore.toFixed(2)}</span>
                        </p>
                      </div>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteFeature(feature.id)}
                      >
                        ×
                      </button>
                    </div>

                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    <div className="feature-details">
                      <div className="detail">
                        <span className="detail-label">Reach:</span>
                        <span className="detail-value">{feature.reach.toLocaleString()} users</span>
                      </div>
                      <div className="detail">
                        <span className="detail-label">Impact:</span>
                        <span className="detail-value">{feature.impact}/5</span>
                      </div>
                      <div className="detail">
                        <span className="detail-label">Confidence:</span>
                        <span className="detail-value">{feature.confidence}%</span>
                      </div>
                      <div className="detail">
                        <span className="detail-label">Effort:</span>
                        <span className="detail-value">{feature.effort} months</span>
                      </div>
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

export default RICEPrioritization;
