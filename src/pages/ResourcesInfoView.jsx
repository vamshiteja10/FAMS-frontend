import React, { useState, useEffect } from 'react';
import { MarketPriceTicker } from '../components/MarketPriceTicker';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';

export const ResourcesInfoView = () => {
  const [resources, setResources] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const resData = await api.resources.getAll();
    const annData = await api.announcements.getAll();
    setResources(resData);
    setAnnouncements(annData);
    setLoading(false);
  };

  const filteredResources = resources.filter(r => {
    const matchCategory = categoryFilter === 'ALL' || r.category === categoryFilter;
    const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Farming Resources & Agricultural Directory</h1>
          <p className="page-subtitle">Access certified seed hybrids, subsidized fertilizers, farm machinery hire, and government welfare schemes</p>
        </div>
      </div>

      {/* APMC Mandi Rates Live Ticker */}
      <div style={{ marginBottom: 24, borderRadius: 12, overflow: 'hidden' }}>
        <MarketPriceTicker />
      </div>

      {/* Official Government Schemes & Urgent Advisories */}
      <div className="ui-card" style={{ marginBottom: 24 }}>
        <div className="ui-card-header">
          <h3 className="ui-card-title">📢 Extension Advisories & Scheme Notifications</h3>
          <span className="badge badge-amber">{announcements.length} Active Notices</span>
        </div>
        <div className="ui-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {announcements.map((ann) => (
              <div
                key={ann.id}
                style={{
                  padding: 16,
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  background: ann.urgency === 'HIGH' ? '#fff1f2' : '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span className="badge badge-purple">{ann.category.replace('_', ' ')}</span>
                    <StatusBadge status={ann.urgency} />
                  </div>
                  <h4 style={{ fontSize: 15, marginBottom: 8, color: '#0f172a' }}>{ann.title}</h4>
                  <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, marginBottom: 12 }}>
                    {ann.content}
                  </p>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 8 }}>
                  Issued by: <strong>{ann.postedBy}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resources Catalog */}
      <div className="ui-card">
        <div className="ui-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h3 className="ui-card-title">🚜 Agricultural Resource Catalog</h3>
            <span className="badge badge-green">{filteredResources.length} Listed</span>
          </div>
          <div className="filter-bar" style={{ margin: 0 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                type="text"
                className="search-input"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="select-input"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="FERTILIZERS">Fertilizers</option>
                <option value="PESTICIDES">Pesticides & Bio-control</option>
                <option value="SEEDS">Certified Seeds</option>
                <option value="MACHINERY">Custom Hiring Machinery</option>
                <option value="GOVT_SCHEME">Govt Schemes & Subsidies</option>
              </select>
            </div>
          </div>
        </div>
        <div className="ui-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {filteredResources.map((res) => (
              <div
                key={res.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#ffffff'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span className="badge badge-blue">{res.category}</span>
                    <StatusBadge status={res.status} />
                  </div>
                  <h4 style={{ fontSize: 16, marginBottom: 8, color: '#0f172a' }}>{res.title}</h4>
                  <p style={{ fontSize: 13, color: '#475569', marginBottom: 14 }}>{res.description}</p>
                  {res.recommendedDosage && (
                    <div style={{ fontSize: 12, background: '#f0fdf4', padding: '6px 10px', borderRadius: 6, color: '#166534', marginBottom: 10 }}>
                      <strong>Recommended Dosage:</strong> {res.recommendedDosage}
                    </div>
                  )}
                </div>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, fontSize: 12, color: '#64748b' }}>
                  <strong>Distribution / Contact:</strong> {res.contactOrLink || 'Local Agri Center'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
