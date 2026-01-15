import React, { useState } from 'react';
import './UserFeedback.css';

function UserFeedback() {
  const [feedbackItems, setFeedbackItems] = useState([
    {
      id: 1,
      title: 'Dark mode needed',
      category: 'UI/UX',
      priority: 'High',
      status: 'Planned',
      date: '2024-01-10',
    },
    {
      id: 2,
      title: 'API response time slow',
      category: 'Performance',
      priority: 'Critical',
      status: 'In Progress',
      date: '2024-01-12',
    },
    {
      id: 3,
      title: 'Mobile app navigation confusing',
      category: 'UI/UX',
      priority: 'High',
      status: 'Under Review',
      date: '2024-01-09',
    },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    category: 'UI/UX',
    priority: 'Medium',
    status: 'New',
  });

  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = [
    'UI/UX',
    'Performance',
    'Features',
    'Bug',
    'Documentation',
    'Security',
  ];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const statuses = ['New', 'Under Review', 'In Progress', 'Planned', 'Completed'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddFeedback = () => {
    if (formData.title) {
      const newFeedback = {
        id: Math.max(...feedbackItems.map((f) => f.id), 0) + 1,
        ...formData,
        date: new Date().toISOString().split('T')[0],
      };
      setFeedbackItems([newFeedback, ...feedbackItems]);
      setFormData({
        title: '',
        category: 'UI/UX',
        priority: 'Medium',
        status: 'New',
      });
    } else {
      alert('Please enter feedback title');
    }
  };

  const handleDeleteFeedback = (id) => {
    setFeedbackItems(feedbackItems.filter((f) => f.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setFeedbackItems(
      feedbackItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const handlePriorityChange = (id, newPriority) => {
    setFeedbackItems(
      feedbackItems.map((item) =>
        item.id === id ? { ...item, priority: newPriority } : item
      )
    );
  };

  const filteredFeedback = feedbackItems.filter((item) => {
    const priorityMatch =
      filterPriority === 'All' || item.priority === filterPriority;
    const categoryMatch =
      filterCategory === 'All' || item.category === filterCategory;
    return priorityMatch && categoryMatch;
  });

  const priorityColors = {
    'Critical': '#ef4444',
    'High': '#f97316',
    'Medium': '#eab308',
    'Low': '#10b981',
  };

  const categoryColors = {
    'UI/UX': '#8b5cf6',
    'Performance': '#ec4899',
    'Features': '#0ea5e9',
    'Bug': '#ef4444',
    'Documentation': '#6366f1',
    'Security': '#059669',
  };

  const getStats = () => {
    const stats = {
      Total: feedbackItems.length,
      New: feedbackItems.filter((f) => f.status === 'New').length,
      Critical: feedbackItems.filter((f) => f.priority === 'Critical').length,
    };
    return stats;
  };

  const stats = getStats();

  return (
    <div className="feedback-container">
      <h2>💬 User Feedback Management</h2>

      <div className="feedback-stats">
        <div className="stat-box">
          <span className="stat-label">Total Feedback</span>
          <span className="stat-value">{stats.Total}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">New Items</span>
          <span className="stat-value">{stats.New}</span>
        </div>
        <div className="stat-box critical">
          <span className="stat-label">Critical</span>
          <span className="stat-value">{stats.Critical}</span>
        </div>
      </div>

      <div className="feedback-content">
        <div className="feedback-input-section">
          <h3>Submit Feedback</h3>

          <div className="form-group">
            <label>Feedback Title *</label>
            <textarea
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Describe the feedback..."
              rows="4"
            ></textarea>
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
              <label>Priority *</label>
              <select name="priority" value={formData.priority} onChange={handleInputChange}>
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="add-button" onClick={handleAddFeedback}>
            ➕ Add Feedback
          </button>

          <div className="legend">
            <h4>Priority Levels</h4>
            <div className="legend-items">
              {priorities.map((p) => (
                <div key={p} className="legend-item">
                  <span
                    className="legend-dot"
                    style={{ backgroundColor: priorityColors[p] }}
                  ></span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="feedback-list-section">
          <h3>Feedback Items</h3>

          <div className="filter-section">
            <div className="filter-group">
              <label>Filter by Priority:</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="All">All Priorities</option>
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Filter by Category:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredFeedback.length === 0 ? (
            <p className="empty-message">No feedback items match your filters.</p>
          ) : (
            <div className="feedback-list">
              {filteredFeedback.map((item) => (
                <div key={item.id} className="feedback-item">
                  <div className="feedback-header">
                    <h4>{item.title}</h4>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteFeedback(item.id)}
                    >
                      ×
                    </button>
                  </div>

                  <div className="feedback-tags">
                    <span
                      className="category-tag"
                      style={{ backgroundColor: categoryColors[item.category] }}
                    >
                      {item.category}
                    </span>
                    <select
                      className="priority-select"
                      value={item.priority}
                      onChange={(e) => handlePriorityChange(item.id, e.target.value)}
                      style={{ borderColor: priorityColors[item.priority] }}
                    >
                      {priorities.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="feedback-footer">
                    <div className="status-section">
                      <label>Status:</label>
                      <select
                        className="status-select"
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <span className="feedback-date">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserFeedback;
