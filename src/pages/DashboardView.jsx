import React, { useState, useEffect } from 'react';
import { MetricCard } from '../components/MetricCard';
import { WeatherWidget } from '../components/WeatherWidget';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';

export const DashboardView = ({ setActiveTab, currentRole }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [currentRole]);

  const loadDashboard = async () => {
    setLoading(true);
    const data = await api.dashboard.getStats();
    setStats(data);
    setLoading(false);
  };

  if (loading || !stats) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
        <p>Loading Agricultural Dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Agricultural Operations Dashboard</h1>
          <p className="page-subtitle">Centralized monitoring of farm acreage, crop growth stages, and advisories</p>
        </div>
        {currentRole === 'ROLE_FARMER' && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" onClick={() => setActiveTab('crops')}>
              <span>➕ Register New Crop</span>
            </button>
            <button className="btn-secondary" onClick={() => setActiveTab('records')}>
              <span>📝 Log Cultivation Activity</span>
            </button>
          </div>
        )}
      </div>

      {/* Live Agro-Weather Advisory */}
      <WeatherWidget />

      {/* KPI Metrics */}
      <div className="metrics-grid">
        <MetricCard
          title="Registered Land Parcels"
          value={stats.totalLandParcels}
          icon="🏞️"
          colorTheme="green"
          subtitle={`${stats.totalAreaAcres || 0} Total Cultivable Acres`}
        />
        <MetricCard
          title="Active Crops"
          value={stats.activeCropsCount}
          icon="🌾"
          colorTheme="blue"
          subtitle="Monitored in current season"
        />
        <MetricCard
          title="Cultivation Activities"
          value={stats.totalCultivationActivities}
          icon="📋"
          colorTheme="amber"
          subtitle="Irrigation, fertilizer & spray logs"
        />
        <MetricCard
          title="Resources & Schemes"
          value={stats.availableResourcesCount}
          icon="🚜"
          colorTheme="purple"
          subtitle="Subsidized inputs & equipment"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        {/* Active Crops Widget */}
        <div className="ui-card">
          <div className="ui-card-header">
            <h3 className="ui-card-title">🌱 Active Crop Cycles</h3>
            <button
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: 12 }}
              onClick={() => setActiveTab('crops')}
            >
              View All
            </button>
          </div>
          <div className="ui-card-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Crop / Variety</th>
                    <th>Plot / Land</th>
                    <th>Sown Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.recentCrops || []).map((crop) => (
                    <tr key={crop.id}>
                      <td>
                        <strong>{crop.cropName}</strong>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{crop.variety || 'Standard'}</div>
                      </td>
                      <td>{crop.landParcelName || 'Main Field'}</td>
                      <td>{crop.sowingDate}</td>
                      <td><StatusBadge status={crop.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Official Announcements & Advisories */}
        <div className="ui-card">
          <div className="ui-card-header">
            <h3 className="ui-card-title">📢 Agricultural Advisories & Alerts</h3>
            <button
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: 12 }}
              onClick={() => setActiveTab('resources')}
            >
              All Notices
            </button>
          </div>
          <div className="ui-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(stats.recentAnnouncements || []).map((ann) => (
              <div
                key={ann.id}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  background: ann.urgency === 'HIGH' ? '#fff1f2' : '#f8fafc'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <strong style={{ fontSize: 14, color: ann.urgency === 'HIGH' ? '#991b1b' : '#0f172a' }}>
                    {ann.title}
                  </strong>
                  <StatusBadge status={ann.urgency} />
                </div>
                <p style={{ fontSize: 13, color: '#475569', marginBottom: 6 }}>{ann.content}</p>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>
                  Posted by: <em>{ann.postedBy}</em>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
