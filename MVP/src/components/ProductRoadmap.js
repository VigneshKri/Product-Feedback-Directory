import React, { useState } from 'react';
import './ProductRoadmap.css';

function ProductRoadmap() {
  const [roadmapItems, setRoadmapItems] = useState([
    {
      id: 1,
      feature: 'User Authentication',
      quarter: 'Q1',
      status: 'Completed',
      owner: 'Engineering',
      description: 'Implement secure login and signup',
    },
    {
      id: 2,
      feature: 'Payment Integration',
      quarter: 'Q1',
      status: 'In Progress',
      owner: 'Backend Team',
      description: 'Stripe payment processing',
    },
    {
      id: 3,
      feature: 'Analytics Dashboard',
      quarter: 'Q2',
      status: 'Planned',
      owner: 'Product Analytics',
      description: 'Real-time user activity tracking',
    },
    {
      id: 4,
      feature: 'Mobile App',
      quarter: 'Q2',
      status: 'Planned',
      owner: 'Mobile Team',
      description: 'iOS and Android native apps',
    },
    {
      id: 5,
      feature: 'AI Recommendations',
      quarter: 'Q3',
      status: 'Planned',
      owner: 'ML Team',
      description: 'Machine learning powered personalization',
    },
  ]);

  const [formData, setFormData] = useState({
    feature: '',
    quarter: 'Q1',
    status: 'Planned',
    owner: '',
    description: '',
  });

  const statusColors = {
    'Completed': '#10b981',
    'In Progress': '#f59e0b',
    'Planned': '#6366f1',
    'Delayed': '#ef4444',
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddItem = () => {
    if (formData.feature && formData.owner) {
      const newItem = {
        id: Math.max(...roadmapItems.map((i) => i.id), 0) + 1,
        ...formData,
      };
      setRoadmapItems([...roadmapItems, newItem]);
      setFormData({
        feature: '',
        quarter: 'Q1',
        status: 'Planned',
        owner: '',
        description: '',
      });
    } else {
      alert('Please fill in feature name and owner');
    }
  };

  const handleDeleteItem = (id) => {
    setRoadmapItems(roadmapItems.filter((i) => i.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setRoadmapItems(
      roadmapItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const statuses = ['Planned', 'In Progress', 'Completed', 'Delayed'];

  const getStats = () => {
    const total = roadmapItems.length;
    const completed = roadmapItems.filter((i) => i.status === 'Completed').length;
    const inProgress = roadmapItems.filter((i) => i.status === 'In Progress').length;
    const planned = roadmapItems.filter((i) => i.status === 'Planned').length;

    return { total, completed, inProgress, planned };
  };

  const stats = getStats();

  return (
    <div className="roadmap-container">
      <h2>🗺️ Product Roadmap</h2>

      <div className="roadmap-stats">
        <div className="stat-box">
          <span className="stat-label">Total Features</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-box completed">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
        <div className="stat-box inprogress">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{stats.inProgress}</span>
        </div>
        <div className="stat-box planned">
          <span className="stat-label">Planned</span>
          <span className="stat-value">{stats.planned}</span>
        </div>
      </div>

      <div className="roadmap-content">
        <div className="roadmap-input-section">
          <h3>Add Roadmap Item</h3>

          <div className="form-group">
            <label>Feature Name *</label>
            <input
              type="text"
              name="feature"
              value={formData.feature}
              onChange={handleInputChange}
              placeholder="e.g., API Versioning"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quarter *</label>
              <select name="quarter" value={formData.quarter} onChange={handleInputChange}>
                {quarters.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={formData.status} onChange={handleInputChange}>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Owner/Team *</label>
            <input
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleInputChange}
              placeholder="e.g., Frontend Team"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add details about this feature"
              rows="3"
            ></textarea>
          </div>

          <button className="add-button" onClick={handleAddItem}>
            + Add Item
          </button>
        </div>

        <div className="roadmap-timeline-section">
          <h3>Timeline View</h3>

          {quarters.map((quarter) => {
            const itemsInQuarter = roadmapItems.filter((item) => item.quarter === quarter);
            return (
              <div key={quarter} className="quarter-section">
                <h4>{quarter} 2024</h4>
                <div className="items-container">
                  {itemsInQuarter.length === 0 ? (
                    <p className="empty-quarter">No items planned for {quarter}</p>
                  ) : (
                    itemsInQuarter.map((item) => (
                      <div
                        key={item.id}
                        className="roadmap-item"
                        style={{
                          borderLeftColor: statusColors[item.status],
                        }}
                      >
                        <div className="item-header">
                          <h5>{item.feature}</h5>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            ×
                          </button>
                        </div>

                        <div className="item-meta">
                          <span className="owner-badge">{item.owner}</span>
                          <select
                            className="status-select"
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            style={{
                              borderColor: statusColors[item.status],
                              color: statusColors[item.status],
                            }}
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        {item.description && (
                          <p className="item-description">{item.description}</p>
                        )}

                        <div className="status-indicator">
                          <div
                            className="status-dot"
                            style={{ backgroundColor: statusColors[item.status] }}
                          ></div>
                          <span>{item.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductRoadmap;
