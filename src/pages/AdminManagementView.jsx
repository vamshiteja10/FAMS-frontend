import React, { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';

export const AdminManagementView = () => {
  const [farmers, setFarmers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Announcement Modal
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [annFormData, setAnnFormData] = useState({
    title: '',
    category: 'WEATHER_ALERT',
    content: '',
    urgency: 'HIGH',
    postedBy: 'Dr. S. K. Verma, District Agri Officer'
  });

  // Resource Modal
  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [resFormData, setResFormData] = useState({
    title: '',
    category: 'FERTILIZERS',
    description: '',
    recommendedDosage: '',
    contactOrLink: '',
    status: 'AVAILABLE'
  });

  // Farmer CRUD Modal
  const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [farmerFormData, setFarmerFormData] = useState({
    username: '',
    password: 'pass123',
    fullName: '',
    email: '',
    phone: '',
    village: '',
    district: '',
    state: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateFarmer = () => {
    setEditingFarmer(null);
    setFarmerFormData({
      username: 'farmer_' + Math.floor(1000 + Math.random() * 9000),
      password: 'pass123',
      fullName: '',
      email: '',
      phone: '',
      village: '',
      district: '',
      state: ''
    });
    setIsFarmerModalOpen(true);
  };

  const handleOpenEditFarmer = (farmer) => {
    setEditingFarmer(farmer);
    setFarmerFormData({
      username: farmer.username,
      password: 'pass123',
      fullName: farmer.fullName,
      email: farmer.email || '',
      phone: farmer.phone || '',
      village: '',
      district: '',
      state: ''
    });
    setIsFarmerModalOpen(true);
  };

  const handleFarmerSubmit = async (e) => {
    e.preventDefault();
    if (!farmerFormData.fullName || !farmerFormData.username) return;
    try {
      if (editingFarmer) {
        await api.farmer.update(editingFarmer.id, farmerFormData);
      } else {
        await api.farmer.create(farmerFormData);
      }
      setIsFarmerModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Error saving farmer');
    }
  };

  const handleDeleteFarmer = async (id) => {
    if (window.confirm('Are you sure you want to delete this farmer record?')) {
      try {
        await api.farmer.delete(id);
        loadData();
      } catch (err) {
        alert(err.message || 'Error deleting farmer');
      }
    }
  };

  const loadData = async () => {
    setLoading(true);
    const farmerData = await api.auth.getFarmers();
    const annData = await api.announcements.getAll();
    const resData = await api.resources.getAll();
    const statData = await api.dashboard.getStats();
    setFarmers(farmerData);
    setAnnouncements(annData);
    setResources(resData);
    setStats(statData);
    setLoading(false);
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!annFormData.title || !annFormData.content) return;
    await api.announcements.create(annFormData);
    setIsAnnModalOpen(false);
    setAnnFormData({
      title: '',
      category: 'WEATHER_ALERT',
      content: '',
      urgency: 'HIGH',
      postedBy: 'Dr. S. K. Verma, District Agri Officer'
    });
    loadData();
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      await api.announcements.delete(id);
      loadData();
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    if (!resFormData.title || !resFormData.description) return;
    await api.resources.create(resFormData);
    setIsResModalOpen(false);
    setResFormData({
      title: '',
      category: 'FERTILIZERS',
      description: '',
      recommendedDosage: '',
      contactOrLink: '',
      status: 'AVAILABLE'
    });
    loadData();
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Remove this resource from the catalog?')) {
      await api.resources.delete(id);
      loadData();
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Agricultural Officer & Administrator Hub</h1>
          <p className="page-subtitle">Supervise registered farmers, broadcast pest/weather advisories, and manage subsidized resources</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary" onClick={handleOpenCreateFarmer}>
            <span>👨‍🌾 + Add Farmer</span>
          </button>
          <button className="btn-secondary" onClick={() => setIsAnnModalOpen(true)}>
            <span>📢 Post Public Advisory</span>
          </button>
          <button className="btn-secondary" onClick={() => setIsResModalOpen(true)}>
            <span>🚜 Add Agri Resource</span>
          </button>
        </div>
      </div>

      {/* District Admin KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#ffffff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase' }}>Supervised Farmers</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{farmers.length} Registered</div>
        </div>
        <div style={{ background: '#ffffff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase' }}>Total Land Monitored</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#16a34a' }}>{stats?.totalAreaAcres || 0} Acres</div>
        </div>
        <div style={{ background: '#ffffff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase' }}>Broadcasted Advisories</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0284c7' }}>{announcements.length} Notices</div>
        </div>
        <div style={{ background: '#ffffff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase' }}>Approved Resources</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#7c3aed' }}>{resources.length} Items</div>
        </div>
      </div>

      {/* Registered Farmers Roster */}
      <div className="ui-card">
        <div className="ui-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="ui-card-title">👨‍🌾 Registered Farmers in District Jurisdiction</h3>
          <button className="btn-primary" style={{ padding: '6px 14px', fontSize: 13 }} onClick={handleOpenCreateFarmer}>
            + Add Farmer
          </button>
        </div>
        <div className="ui-card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Farmer ID</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map((f) => (
                  <tr key={f.id}>
                    <td><code>#FRM-{f.id}</code></td>
                    <td><strong>{f.fullName}</strong></td>
                    <td>{f.username}</td>
                    <td>{f.email}</td>
                    <td>{f.phone || '9876543210'}</td>
                    <td><span className="badge badge-green">Active & Verified</span></td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={() => handleOpenEditFarmer(f)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-danger-outline"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={() => handleDeleteFarmer(f.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Active Advisories Management */}
      <div className="ui-card">
        <div className="ui-card-header">
          <h3 className="ui-card-title">📢 Broadcasted Extension Advisories</h3>
        </div>
        <div className="ui-card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Urgency</th>
                  <th>Issued Date</th>
                  <th>Officer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((ann) => (
                  <tr key={ann.id}>
                    <td><strong>{ann.title}</strong></td>
                    <td><span className="badge badge-purple">{ann.category}</span></td>
                    <td><StatusBadge status={ann.urgency} /></td>
                    <td>{ann.createdAt ? ann.createdAt.split('T')[0] : 'Recent'}</td>
                    <td>{ann.postedBy}</td>
                    <td>
                      <button
                        className="btn-danger-outline"
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                      >
                        Delete Notice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Post Public Advisory */}
      <Modal
        isOpen={isAnnModalOpen}
        onClose={() => setIsAnnModalOpen(false)}
        title="Broadcast New Advisory / Alert"
      >
        <form onSubmit={handlePostAnnouncement}>
          <div className="form-group">
            <label className="form-label">Advisory Headline *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Pink Bollworm Vigilance in Cotton Fields"
              value={annFormData.title}
              onChange={(e) => setAnnFormData({ ...annFormData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={annFormData.category}
                onChange={(e) => setAnnFormData({ ...annFormData, category: e.target.value })}
              >
                <option value="WEATHER_ALERT">Weather Alert</option>
                <option value="PEST_WARNING">Pest & Disease Warning</option>
                <option value="GOVT_SCHEME">Govt Scheme Notification</option>
                <option value="MARKET_UPDATE">Market / Mandi Price Update</option>
                <option value="GENERAL">General Agro Extension</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Urgency Level</label>
              <select
                className="form-control"
                value={annFormData.urgency}
                onChange={(e) => setAnnFormData({ ...annFormData, urgency: e.target.value })}
              >
                <option value="LOW">Low (Informational)</option>
                <option value="MEDIUM">Medium (Advisory)</option>
                <option value="HIGH">High (Immediate Action)</option>
                <option value="EMERGENCY">Emergency Warning</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Advisory Content & Guidelines *</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Detailed guidelines, dosages, preventive actions..."
              value={annFormData.content}
              onChange={(e) => setAnnFormData({ ...annFormData, content: e.target.value })}
              required
            />
          </div>
          <div className="modal-footer" style={{ margin: '20px -24px -24px', padding: '16px 24px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsAnnModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Broadcast Advisory
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Agri Resource */}
      <Modal
        isOpen={isResModalOpen}
        onClose={() => setIsResModalOpen(false)}
        title="Add Approved Agricultural Resource"
      >
        <form onSubmit={handleCreateResource}>
          <div className="form-group">
            <label className="form-label">Resource Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Neem Coated Urea (46% N)"
              value={resFormData.title}
              onChange={(e) => setResFormData({ ...resFormData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={resFormData.category}
                onChange={(e) => setResFormData({ ...resFormData, category: e.target.value })}
              >
                <option value="FERTILIZERS">Fertilizers</option>
                <option value="PESTICIDES">Pesticides</option>
                <option value="SEEDS">Seeds</option>
                <option value="MACHINERY">Machinery</option>
                <option value="GOVT_SCHEME">Govt Scheme</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={resFormData.status}
                onChange={(e) => setResFormData({ ...resFormData, status: e.target.value })}
              >
                <option value="AVAILABLE">Available</option>
                <option value="SUBSIDIZED">Subsidized</option>
                <option value="INFO_ONLY">Information Only</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Recommended Dosage / Guidelines</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., 45 kg per acre in split doses"
              value={resFormData.recommendedDosage}
              onChange={(e) => setResFormData({ ...resFormData, recommendedDosage: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Key specifications, benefits, application method..."
              value={resFormData.description}
              onChange={(e) => setResFormData({ ...resFormData, description: e.target.value })}
              required
            />
          </div>
          <div className="modal-footer" style={{ margin: '20px -24px -24px', padding: '16px 24px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsResModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Resource
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add / Edit Farmer */}
      <Modal
        isOpen={isFarmerModalOpen}
        onClose={() => setIsFarmerModalOpen(false)}
        title={editingFarmer ? "Edit Farmer Details" : "Register New Farmer"}
      >
        <form onSubmit={handleFarmerSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Ramesh Kumar"
              value={farmerFormData.fullName}
              onChange={(e) => setFarmerFormData({ ...farmerFormData, fullName: e.target.value })}
              required
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Username *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., farmer_ramesh"
                value={farmerFormData.username}
                onChange={(e) => setFarmerFormData({ ...farmerFormData, username: e.target.value })}
                required
                disabled={!!editingFarmer}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., 9876543210"
                value={farmerFormData.phone}
                onChange={(e) => setFarmerFormData({ ...farmerFormData, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g., ramesh@farmassist.in"
              value={farmerFormData.email}
              onChange={(e) => setFarmerFormData({ ...farmerFormData, email: e.target.value })}
            />
          </div>
          <div className="modal-footer" style={{ margin: '20px -24px -24px', padding: '16px 24px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsFarmerModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingFarmer ? "Save Changes" : "Register Farmer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
