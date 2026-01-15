import React, { useState } from 'react';
import './ABTestCalculator.css';

function ABTestCalculator() {
  const [tests, setTests] = useState([
    {
      id: 1,
      name: 'Signup Button Color',
      controlConversions: 120,
      controlSamples: 2000,
      variantConversions: 145,
      variantSamples: 2000,
      confidenceLevel: 95,
    },
    {
      id: 2,
      name: 'Email Subject Line',
      controlConversions: 350,
      controlSamples: 5000,
      variantConversions: 380,
      variantSamples: 5000,
      confidenceLevel: 90,
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    controlConversions: '',
    controlSamples: '',
    variantConversions: '',
    variantSamples: '',
    confidenceLevel: 95,
  });

  // Z-score values for different confidence levels
  const zScores = {
    90: 1.645,
    95: 1.96,
    99: 2.576,
  };

  const calculateStats = (
    controlConv,
    controlSamp,
    variantConv,
    variantSamp,
    confidence
  ) => {
    const controlRate = controlConv / controlSamp;
    const variantRate = variantConv / variantSamp;
    const pooledRate = (controlConv + variantConv) / (controlSamp + variantSamp);

    const standardError = Math.sqrt(
      (pooledRate * (1 - pooledRate)) * (1 / controlSamp + 1 / variantSamp)
    );

    const zScore = (variantRate - controlRate) / standardError;
    const zCritical = zScores[confidence] || 1.96;
    const isSignificant = Math.abs(zScore) > zCritical;

    const lift = ((variantRate - controlRate) / controlRate) * 100;

    return {
      controlRate: (controlRate * 100).toFixed(2),
      variantRate: (variantRate * 100).toFixed(2),
      lift: lift.toFixed(2),
      zScore: zScore.toFixed(2),
      isSignificant,
      sampleSizePerVariant: Math.ceil(
        (2 * (zCritical + 0.84) ** 2 * pooledRate * (1 - pooledRate)) /
          (lift / 100) ** 2
      ),
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'name' ? value : parseFloat(value) || '',
    });
  };

  const handleAddTest = () => {
    if (
      formData.name &&
      formData.controlConversions &&
      formData.controlSamples &&
      formData.variantConversions &&
      formData.variantSamples
    ) {
      const newTest = {
        id: Math.max(...tests.map((t) => t.id), 0) + 1,
        ...formData,
      };
      setTests([...tests, newTest]);
      setFormData({
        name: '',
        controlConversions: '',
        controlSamples: '',
        variantConversions: '',
        variantSamples: '',
        confidenceLevel: 95,
      });
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleDeleteTest = (id) => {
    setTests(tests.filter((t) => t.id !== id));
  };

  const getTestStats = () => {
    const total = tests.length;
    const significant = tests.filter((t) => {
      const stats = calculateStats(
        t.controlConversions,
        t.controlSamples,
        t.variantConversions,
        t.variantSamples,
        t.confidenceLevel
      );
      return stats.isSignificant;
    }).length;
    const avgLift = (
      tests.reduce((acc, t) => {
        const stats = calculateStats(
          t.controlConversions,
          t.controlSamples,
          t.variantConversions,
          t.variantSamples,
          t.confidenceLevel
        );
        return acc + parseFloat(stats.lift);
      }, 0) / Math.max(tests.length, 1)
    ).toFixed(2);

    return { total, significant, avgLift };
  };

  const stats = getTestStats();

  return (
    <div className="abtest-container">
      <h2>🧪 A/B Test Calculator</h2>

      <div className="abtest-stats">
        <div className="stat-box">
          <span className="stat-label">Total Tests</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Significant</span>
          <span className="stat-value">{stats.significant}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Avg Lift</span>
          <span className="stat-value">{stats.avgLift}%</span>
        </div>
      </div>

      <div className="abtest-content">
        <div className="abtest-input-section">
          <h3>Create New Test</h3>

          <div className="form-group">
            <label>Test Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., CTA Button Color"
            />
          </div>

          <div className="section-label">Control Group</div>
          <div className="form-row">
            <div className="form-group">
              <label>Conversions *</label>
              <input
                type="number"
                name="controlConversions"
                value={formData.controlConversions}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Sample Size *</label>
              <input
                type="number"
                name="controlSamples"
                value={formData.controlSamples}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="section-label">Variant Group</div>
          <div className="form-row">
            <div className="form-group">
              <label>Conversions *</label>
              <input
                type="number"
                name="variantConversions"
                value={formData.variantConversions}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Sample Size *</label>
              <input
                type="number"
                name="variantSamples"
                value={formData.variantSamples}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Confidence Level *</label>
            <select name="confidenceLevel" value={formData.confidenceLevel} onChange={handleInputChange}>
              <option value={90}>90% Confidence</option>
              <option value={95}>95% Confidence</option>
              <option value={99}>99% Confidence</option>
            </select>
          </div>

          <button className="add-button" onClick={handleAddTest}>
            ➕ Run Test
          </button>

          <div className="info-box">
            <h4>How It Works</h4>
            <ul>
              <li>Compare two variants statistically</li>
              <li>Z-score determines significance</li>
              <li>Lift shows improvement percentage</li>
              <li>Sample size recommendations included</li>
            </ul>
          </div>
        </div>

        <div className="abtest-results-section">
          <h3>Test Results</h3>

          {tests.length === 0 ? (
            <p className="empty-message">No tests yet. Create one to get started!</p>
          ) : (
            <div className="tests-list">
              {tests.map((test) => {
                const stats = calculateStats(
                  test.controlConversions,
                  test.controlSamples,
                  test.variantConversions,
                  test.variantSamples,
                  test.confidenceLevel
                );

                return (
                  <div key={test.id} className="test-card">
                    <div className="test-header">
                      <h4>{test.name}</h4>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteTest(test.id)}
                      >
                        ×
                      </button>
                    </div>

                    <div className={`significance-badge ${stats.isSignificant ? 'significant' : 'not-significant'}`}>
                      {stats.isSignificant
                        ? '✓ Statistically Significant'
                        : '✗ Not Significant'}
                    </div>

                    <div className="test-metrics">
                      <div className="metric">
                        <span className="metric-label">Control Rate</span>
                        <span className="metric-value">{stats.controlRate}%</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Variant Rate</span>
                        <span className="metric-value">{stats.variantRate}%</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Lift</span>
                        <span className="metric-value lift-value">
                          {stats.lift > 0 ? '+' : ''}{stats.lift}%
                        </span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Z-Score</span>
                        <span className="metric-value">{stats.zScore}</span>
                      </div>
                    </div>

                    <div className="test-details">
                      <div className="detail-row">
                        <span>Control Sample:</span>
                        <span>{test.controlSamples.toLocaleString()} visitors</span>
                      </div>
                      <div className="detail-row">
                        <span>Variant Sample:</span>
                        <span>{test.variantSamples.toLocaleString()} visitors</span>
                      </div>
                      <div className="detail-row">
                        <span>Confidence Level:</span>
                        <span>{test.confidenceLevel}%</span>
                      </div>
                      <div className="detail-row recommended">
                        <span>Recommended Sample Size Per Variant:</span>
                        <span>{stats.sampleSizePerVariant.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="test-conclusion">
                      {stats.isSignificant ? (
                        <p>
                          The variant performs {Math.abs(stats.lift)}% {stats.lift > 0 ? 'better' : 'worse'} than the
                          control with {test.confidenceLevel}% confidence.
                        </p>
                      ) : (
                        <p>
                          Not enough data to determine significance. Run the test longer or collect more samples.
                        </p>
                      )}
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

export default ABTestCalculator;
