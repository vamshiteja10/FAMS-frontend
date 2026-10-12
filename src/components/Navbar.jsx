import React from 'react';

export const Navbar = ({ currentRole, setCurrentRole, activeFarmer }) => {
  return (
    <header className="top-navbar">
      <div className="role-switcher-wrap">
        <span className="role-switcher-badge">VIEW MODE:</span>
        <div className="role-btn-group">
          <button
            className={`role-btn ${currentRole === 'ROLE_FARMER' ? 'active' : ''}`}
            onClick={() => setCurrentRole('ROLE_FARMER')}
          >
            🌾 Farmer
          </button>
          <button
            className={`role-btn ${currentRole === 'ROLE_OFFICER' ? 'active' : ''}`}
            onClick={() => setCurrentRole('ROLE_OFFICER')}
          >
            👔 Agri Officer
          </button>
          <button
            className={`role-btn ${currentRole === 'PUBLIC' ? 'active' : ''}`}
            onClick={() => setCurrentRole('PUBLIC')}
          >
            🌐 Public
          </button>
        </div>
      </div>

      <div className="user-profile-badge">
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
            {currentRole === 'ROLE_FARMER' ? (activeFarmer?.fullName || 'Ramesh Patel') : currentRole === 'ROLE_OFFICER' ? 'Dr. S. K. Verma' : 'K. Vamshi Teja'}
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>
            {currentRole === 'ROLE_FARMER' ? 'Verified Farmer · Pune, MH' : currentRole === 'ROLE_OFFICER' ? 'District Agricultural Officer' : 'Student: 24EG104B63 · ECE-B'}
          </div>
        </div>
        <div className="user-avatar" title="Developer: K. Vamshi Teja (24EG104B63)">
          {currentRole === 'ROLE_FARMER' ? '👨‍🌾' : currentRole === 'ROLE_OFFICER' ? '👨‍💼' : '🎓'}
        </div>
      </div>
    </header>
  );
};
