import React, { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { api } from '../services/api';

export const ProfileLandView = ({ currentRole, activeFarmer }) => {
  const [profile, setProfile] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParcel, setEditingParcel] = useState(null);
  const [formData, setFormData] = useState({
    parcelName: '',
    surveyNumber: '',
    totalAreaAcres: '',
    soilType: 'Black',
    irrigationType: 'Drip',
    villageLocation: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, [activeFarmer]);

  const loadData = async () => {
    setLoading(true);
    const prof = await api.farmer.getProfile(activeFarmer?.id || 1);
    const land = await api.land.getByUser(activeFarmer?.id || 1);
    setProfile(prof);
    setParcels(land);
    setLoading(false);
  };

  const handleOpenCreateModal = () => {
    setEditingParcel(null);
    setFormData({
      parcelName: '',
      surveyNumber: '',
      totalAreaAcres: '',
      soilType: 'Black',
      irrigationType: 'Drip',
      villageLocation: profile?.village || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (parcel) => {
    setEditingParcel(parcel);
    setFormData({
      parcelName: parcel.parcelName,
      surveyNumber: parcel.surveyNumber,
      totalAreaAcres: parcel.totalAreaAcres,
      soilType: parcel.soilType,
      irrigationType: parcel.irrigationType,
      villageLocation: parcel.villageLocation || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.parcelName.trim()) errors.parcelName = 'Parcel name is required';
    if (!formData.surveyNumber.trim()) errors.surveyNumber = 'Survey number is required';
    if (!formData.totalAreaAcres || Number(formData.totalAreaAcres) <= 0) {
      errors.totalAreaAcres = 'Enter a valid area in acres (> 0)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      userId: activeFarmer?.id || 1,
      totalAreaAcres: parseFloat(formData.totalAreaAcres)
    };

    if (editingParcel) {
      await api.land.update(editingParcel.id, payload);
    } else {
      await api.land.create(payload);
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this land parcel? Associated crop records may be affected.')) {
      await api.land.delete(id);
      loadData();
    }
  };

  const filteredParcels = parcels.filter(p =>
    p.parcelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.soilType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAcres = parcels.reduce((sum, p) => sum + Number(p.totalAreaAcres || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile & Land Management</h1>
          <p className="page-subtitle">Register farm holdings, survey plots, soil profiles, and irrigation infrastructure</p>
        </div>
        <button className="btn-primary" onClick={handleOpenCreateModal}>
          <span>➕ Add Land Parcel</span>
        </button>
      </div>

      {/* Farmer Profile Card */}
      <div className="ui-card" style={{ marginBottom: 24 }}>
        <div className="ui-card-header">
          <h3 className="ui-card-title">👨‍🌾 Farmer Bio & Agricultural Credentials</h3>
          <span className="badge badge-green">Verified Landholder</span>
        </div>
        <div className="ui-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            <div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Full Name</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{activeFarmer?.fullName || 'Ramesh Patel'}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Registered Village & District</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>
                {profile?.village || 'Khed'}, {profile?.district || 'Pune'} ({profile?.state || 'MH'})
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Farming Experience</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{profile?.totalExperienceYears || 14} Years</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Primary Water Supply</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{profile?.primaryWaterSource || 'Borewell & Canal'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Land Holdings List */}
      <div className="ui-card">
        <div className="ui-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h3 className="ui-card-title">🏞️ Registered Land Parcels</h3>
            <span className="badge badge-blue">{totalAcres.toFixed(1)} Total Acres</span>
          </div>
          <div className="filter-bar" style={{ margin: 0 }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search by plot, survey no, or soil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="ui-card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Parcel Name</th>
                  <th>Survey Number</th>
                  <th>Area (Acres)</th>
                  <th>Soil Type</th>
                  <th>Irrigation Mode</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParcels.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
                      No land parcels found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredParcels.map((parcel) => (
                    <tr key={parcel.id}>
                      <td>
                        <strong>{parcel.parcelName}</strong>
                      </td>
                      <td><code>{parcel.surveyNumber}</code></td>
                      <td><strong>{parcel.totalAreaAcres}</strong> ac</td>
                      <td>
                        <span className="badge badge-amber">{parcel.soilType}</span>
                      </td>
                      <td>
                        <span className="badge badge-blue">{parcel.irrigationType}</span>
                      </td>
                      <td>{parcel.villageLocation || 'Main Sector'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            className="btn-edit-outline"
                            onClick={() => handleOpenEditModal(parcel)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-danger-outline"
                            onClick={() => handleDelete(parcel.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Add / Edit Land Parcel */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingParcel ? 'Edit Land Parcel' : 'Register New Land Parcel'}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-grid">
            <div className="form-group form-group-full">
              <label className="form-label">Parcel / Plot Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., North Canal Field"
                value={formData.parcelName}
                onChange={(e) => setFormData({ ...formData, parcelName: e.target.value })}
              />
              {formErrors.parcelName && <div className="form-error">{formErrors.parcelName}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Survey Number *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., SY-104/A"
                value={formData.surveyNumber}
                onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })}
              />
              {formErrors.surveyNumber && <div className="form-error">{formErrors.surveyNumber}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Total Area (Acres) *</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="e.g., 4.5"
                value={formData.totalAreaAcres}
                onChange={(e) => setFormData({ ...formData, totalAreaAcres: e.target.value })}
              />
              {formErrors.totalAreaAcres && <div className="form-error">{formErrors.totalAreaAcres}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Soil Type *</label>
              <select
                className="form-control"
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              >
                <option value="Black">Black Soil (Regur)</option>
                <option value="Alluvial">Alluvial Soil</option>
                <option value="Red">Red & Yellow Soil</option>
                <option value="Sandy">Sandy Loam</option>
                <option value="Clay">Clayey Soil</option>
                <option value="Loamy">Loamy Soil</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Irrigation System *</label>
              <select
                className="form-control"
                value={formData.irrigationType}
                onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
              >
                <option value="Drip">Drip Irrigation</option>
                <option value="Sprinkler">Sprinkler Irrigation</option>
                <option value="Canal">Canal Irrigation</option>
                <option value="Borewell">Borewell / Tube Well</option>
                <option value="Rainfed">Rainfed (Dryland)</option>
              </select>
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Village / Location Landmark</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Near East Canal Gate"
                value={formData.villageLocation}
                onChange={(e) => setFormData({ ...formData, villageLocation: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px', padding: '16px 24px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingParcel ? 'Save Changes' : 'Register Parcel'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
