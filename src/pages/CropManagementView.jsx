import React, { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';

export const CropManagementView = ({ activeFarmer, setActiveTab }) => {
  const [crops, setCrops] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seasonFilter, setSeasonFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    landParcelId: '',
    cropName: '',
    variety: '',
    season: 'Kharif',
    sowingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
    expectedYieldQuintals: '',
    status: 'GROWING',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, [activeFarmer]);

  const loadData = async () => {
    setLoading(true);
    const cropData = await api.crops.getByUser(activeFarmer?.id || 1);
    const parcelData = await api.land.getByUser(activeFarmer?.id || 1);
    setCrops(cropData);
    setParcels(parcelData);
    setLoading(false);
  };

  const handleOpenCreateModal = () => {
    setEditingCrop(null);
    const today = new Date();
    const estHarvest = new Date(today);
    estHarvest.setDate(estHarvest.getDate() + 110); // Default 110 days cycle

    setFormData({
      landParcelId: parcels[0]?.id || '',
      cropName: '',
      variety: '',
      season: 'Kharif',
      sowingDate: today.toISOString().split('T')[0],
      expectedHarvestDate: estHarvest.toISOString().split('T')[0],
      expectedYieldQuintals: '',
      status: 'GROWING',
      notes: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (crop) => {
    setEditingCrop(crop);
    setFormData({
      landParcelId: crop.landParcelId,
      cropName: crop.cropName,
      variety: crop.variety || '',
      season: crop.season,
      sowingDate: crop.sowingDate,
      expectedHarvestDate: crop.expectedHarvestDate,
      expectedYieldQuintals: crop.expectedYieldQuintals || '',
      status: crop.status,
      notes: crop.notes || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.cropName.trim()) errors.cropName = 'Crop name is required (e.g. Paddy, Cotton)';
    if (!formData.landParcelId) errors.landParcelId = 'Please select a registered land parcel';
    if (!formData.sowingDate) errors.sowingDate = 'Sowing date is required';
    if (!formData.expectedHarvestDate) errors.expectedHarvestDate = 'Harvest date is required';
    if (new Date(formData.expectedHarvestDate) <= new Date(formData.sowingDate)) {
      errors.expectedHarvestDate = 'Expected harvest date must be after sowing date';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const parcelObj = parcels.find(p => p.id === Number(formData.landParcelId));
    const payload = {
      ...formData,
      landParcelId: Number(formData.landParcelId),
      landParcelName: parcelObj ? parcelObj.parcelName : 'Main Plot',
      userId: activeFarmer?.id || 1,
      farmerName: activeFarmer?.fullName || 'Ramesh Patel',
      expectedYieldQuintals: formData.expectedYieldQuintals ? parseFloat(formData.expectedYieldQuintals) : null
    };

    if (editingCrop) {
      await api.crops.update(editingCrop.id, payload);
    } else {
      await api.crops.create(payload);
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this crop record?')) {
      await api.crops.delete(id);
      loadData();
    }
  };

  const filteredCrops = crops.filter(c => {
    const matchSearch = c.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.variety && c.variety.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchSeason = seasonFilter === 'ALL' || c.season === seasonFilter;
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchSearch && matchSeason && matchStatus;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Crop Lifecycle Management</h1>
          <p className="page-subtitle">Track crop varieties, sowing schedules, irrigation cycles, and harvest forecasts</p>
        </div>
        <button className="btn-primary" onClick={handleOpenCreateModal}>
          <span>➕ Add New Crop</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="ui-card" style={{ marginBottom: 20 }}>
        <div className="ui-card-body" style={{ padding: '16px 20px' }}>
          <div className="filter-bar" style={{ margin: 0 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input
                type="text"
                className="search-input"
                placeholder="Search crops or varieties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="select-input"
                value={seasonFilter}
                onChange={(e) => setSeasonFilter(e.target.value)}
              >
                <option value="ALL">All Seasons</option>
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Zaid">Zaid (Summer)</option>
              </select>
              <select
                className="select-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Growth Stages</option>
                <option value="SOWN">Sown</option>
                <option value="GROWING">Growing (Vegetative)</option>
                <option value="FLOWERING">Flowering / Heading</option>
                <option value="HARVESTED">Harvested</option>
              </select>
            </div>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              Showing <strong>{filteredCrops.length}</strong> crop cycles
            </span>
          </div>
        </div>
      </div>

      {/* Crop Records Table */}
      <div className="ui-card">
        <div className="ui-card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Crop & Variety</th>
                  <th>Plot / Field</th>
                  <th>Season</th>
                  <th>Sowing Date</th>
                  <th>Harvest Target</th>
                  <th>Est. Yield</th>
                  <th>Growth Stage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCrops.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
                      No crop cycles found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCrops.map((crop) => (
                    <tr key={crop.id}>
                      <td>
                        <strong>{crop.cropName}</strong>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{crop.variety || 'Standard Hybrid'}</div>
                      </td>
                      <td>
                        <span style={{ color: '#0f172a', fontWeight: 600 }}>{crop.landParcelName || 'Main Plot'}</span>
                      </td>
                      <td>
                        <span className="badge badge-purple">{crop.season}</span>
                      </td>
                      <td>{crop.sowingDate}</td>
                      <td>{crop.expectedHarvestDate}</td>
                      <td>
                        {crop.expectedYieldQuintals ? (
                          <strong>{crop.expectedYieldQuintals} qtl</strong>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>—</span>
                        )}
                      </td>
                      <td><StatusBadge status={crop.status} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn-edit-outline"
                            onClick={() => handleOpenEditModal(crop)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-danger-outline"
                            onClick={() => handleDelete(crop.id)}
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

      {/* Modal for Add / Edit Crop */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCrop ? 'Edit Crop Details' : 'Register New Crop'}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Crop Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Cotton, Basmati Paddy, Wheat"
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
              />
              {formErrors.cropName && <div className="form-error">{formErrors.cropName}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Variety / Hybrid</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Bt-Cotton RCH-659, Pusa 1121"
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Land Parcel *</label>
              <select
                className="form-control"
                value={formData.landParcelId}
                onChange={(e) => setFormData({ ...formData, landParcelId: e.target.value })}
              >
                {parcels.length === 0 && <option value="">No parcels registered</option>}
                {parcels.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.parcelName} ({p.totalAreaAcres} ac - {p.soilType})
                  </option>
                ))}
              </select>
              {formErrors.landParcelId && <div className="form-error">{formErrors.landParcelId}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Cropping Season *</label>
              <select
                className="form-control"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              >
                <option value="Kharif">Kharif (Monsoon: June-Nov)</option>
                <option value="Rabi">Rabi (Winter: Oct-April)</option>
                <option value="Zaid">Zaid (Summer: March-June)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sowing Date *</label>
              <input
                type="date"
                className="form-control"
                value={formData.sowingDate}
                onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
              />
              {formErrors.sowingDate && <div className="form-error">{formErrors.sowingDate}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Expected Harvest Date *</label>
              <input
                type="date"
                className="form-control"
                value={formData.expectedHarvestDate}
                onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
              />
              {formErrors.expectedHarvestDate && <div className="form-error">{formErrors.expectedHarvestDate}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Target Yield (Quintals)</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                placeholder="e.g., 35.0"
                value={formData.expectedYieldQuintals}
                onChange={(e) => setFormData({ ...formData, expectedYieldQuintals: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Growth Stage</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="SOWN">Sown (Germination Stage)</option>
                <option value="GROWING">Growing (Vegetative Stage)</option>
                <option value="FLOWERING">Flowering / Boll Formation</option>
                <option value="HARVESTED">Harvested / Completed</option>
              </select>
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Cultivation Notes & Soil Moisture Conditions</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Notes on seed treatment, fertilizer recommendations, pest checks..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              {editingCrop ? 'Save Changes' : 'Register Crop'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
