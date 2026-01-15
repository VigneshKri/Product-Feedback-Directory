import React, { useState } from 'react';
import './App.css';
import RICEPrioritization from './components/RICEPrioritization';
import ProductRoadmap from './components/ProductRoadmap';
import UserFeedback from './components/UserFeedback';
import ABTestCalculator from './components/ABTestCalculator';
import KPIDashboard from './components/KPIDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('rice');

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>📊 Product Management Dashboard</h1>
          <p>Comprehensive PM Tools & Frameworks</p>
        </div>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'rice' ? 'active' : ''}`}
          onClick={() => setActiveTab('rice')}
        >
          🎯 RICE Prioritization
        </button>
        <button
          className={`tab-button ${activeTab === 'roadmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('roadmap')}
        >
          🗺️ Roadmap
        </button>
        <button
          className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          💬 User Feedback
        </button>
        <button
          className={`tab-button ${activeTab === 'abtest' ? 'active' : ''}`}
          onClick={() => setActiveTab('abtest')}
        >
          🧪 A/B Tests
        </button>
        <button
          className={`tab-button ${activeTab === 'kpi' ? 'active' : ''}`}
          onClick={() => setActiveTab('kpi')}
        >
          📈 KPI Dashboard
        </button>
      </nav>

      <main className="content-area">
        {activeTab === 'rice' && <RICEPrioritization />}
        {activeTab === 'roadmap' && <ProductRoadmap />}
        {activeTab === 'feedback' && <UserFeedback />}
        {activeTab === 'abtest' && <ABTestCalculator />}
        {activeTab === 'kpi' && <KPIDashboard />}
      </main>

      <footer className="app-footer">
        <p>Demonstrating Product Management Excellence • Built with React</p>
      </footer>
    </div>
  );
}

export default App;
