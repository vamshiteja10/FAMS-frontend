import React from 'react';

export const Sidebar = ({ activeTab, setActiveTab, currentRole }) => {
  const isOfficer = currentRole === 'ROLE_OFFICER';
  const isPublic = currentRole === 'PUBLIC';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">🌱</div>
        <div className="sidebar-brand">
          <h2>FarmAssist</h2>
          <span>Smart Agriculture</span>
        </div>
      </div>

      <div className="sidebar-nav">
        <div className="nav-section-label">Main Navigation</div>

        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="icon">📊</span>
          <span>Dashboard</span>
        </button>

        {!isPublic && (
          <>
            <button
              className={`nav-btn ${activeTab === 'land' ? 'active' : ''}`}
              onClick={() => setActiveTab('land')}
            >
              <span className="icon">🏞️</span>
              <span>Profile & Land</span>
            </button>

            <button
              className={`nav-btn ${activeTab === 'crops' ? 'active' : ''}`}
              onClick={() => setActiveTab('crops')}
            >
              <span className="icon">🌾</span>
              <span>Crop Management</span>
            </button>

            <button
              className={`nav-btn ${activeTab === 'records' ? 'active' : ''}`}
              onClick={() => setActiveTab('records')}
            >
              <span className="icon">📋</span>
              <span>Cultivation Records</span>
            </button>
          </>
        )}

        <button
          className={`nav-btn ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          <span className="icon">🚜</span>
          <span>Resources & Info</span>
        </button>

        {isOfficer && (
          <>
            <div className="nav-section-label">Management Hub</div>
            <button
              className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              <span className="icon">⚙️</span>
              <span>Officer Management</span>
            </button>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="active-role-pill">
          <div className="role-dot"></div>
          <span>Mode: {currentRole === 'ROLE_FARMER' ? 'Farmer View' : currentRole === 'ROLE_OFFICER' ? 'Officer Hub' : 'Public Access'}</span>
        </div>
      </div>
    </aside>
  );
};
