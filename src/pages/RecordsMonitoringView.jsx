import React, { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { api } from '../services/api';

export const RecordsMonitoringView = ({ activeFarmer }) => {
  const [records, setRecords] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCropId, setSelectedCropId] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    cropId: '',
    activityType: 'FERTILIZER',
    activityDate: new Date().toISOString().split('T')[0],
    description: '',
    inputsUsed: '',
    quantityUsed: '',
    costIncurred: '',
    observations: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, [activeFarmer]);

  const loadData = async () => {
    setLoading(true);
    const recData = await api.records.getAll();
    const cropData = await api.crops.getByUser(activeFarmer?.id || 1);
    setRecords(recData);
    setCrops(cropData);
    setLoading(false);
  };

  const handleOpenCreateModal = () => {
    setEditingRecord(null);
    setFormData({
      cropId: crops[0]?.id || '',
      activityType: 'FERTILIZER',
      activityDate: new Date().toISOString().split('T')[0],
      description: '',
      inputsUsed: '',
      quantityUsed: '',
      costIncurred: '',
      observations: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rec) => {
    setEditingRecord(rec);
    setFormData({
      cropId: rec.cropId,
      activityType: rec.activityType,
      activityDate: rec.activityDate,
      description: rec.description,
      inputsUsed: rec.inputsUsed || '',
      quantityUsed: rec.quantityUsed || '',
      costIncurred: rec.costIncurred || '',
      observations: rec.observations || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.cropId) errors.cropId = 'Please select a crop';
    if (!formData.description.trim()) errors.description = 'Activity description is required';
    if (!formData.activityDate) errors.activityDate = 'Date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const cropObj = crops.find(c => c.id === Number(formData.cropId));
    const payload = {
      ...formData,
      cropId: Number(formData.cropId),
      cropName: cropObj ? cropObj.cropName : 'Assigned Crop',
      costIncurred: formData.costIncurred ? parseFloat(formData.costIncurred) : 0
    };

    if (editingRecord) {
      await api.records.update(editingRecord.id, payload);
    } else {
      await api.records.create(payload);
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this cultivation activity record?')) {
      await api.records.delete(id);
      loadData();
    }
  };

  const filteredRecords = records.filter(r => {
    const matchCrop = selectedCropId === 'ALL' || r.cropId === Number(selectedCropId);
    const matchType = selectedType === 'ALL' || r.activityType === selectedType;
    return matchCrop && matchType;
  });

  const totalCost = filteredRecords.reduce((sum, r) => sum + Number(r.costIncurred || 0), 0);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'LAND_PREPARATION': return '🚜';
      case 'SOWING': return '🌱';
      case 'IRRIGATION': return '💧';
      case 'FERTILIZER': return '🧪';
      case 'PEST_CONTROL': return '🛡️';
      case 'WEEDING': return '🌾';
      case 'HARVESTING': return '📦';
      default: return '📋';
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Cultivation Records & Field Monitoring</h1>
          <p className="page-subtitle">Log field operations, input dosages, costs, and crop health observations</p>
        </div>
        <button className="btn-primary" onClick={handleOpenCreateModal}>
          <span>➕ Log Activity</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
        <div style={{ background: '#ffffff', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Total Activities Recorded</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{filteredRecords.length} Logs</div>
        </div>
        <div style={{ background: '#ffffff', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Cumulative Input Costs</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#16a34a' }}>₹{totalCost.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="ui-card" style={{ marginBottom: 20 }}>
        <div className="ui-card-body" style={{ padding: '16px 20px' }}>
          <div className="filter-bar" style={{ margin: 0 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <select
                className="select-input"
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
              >
                <option value="ALL">All Crops</option>
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.cropName} ({c.landParcelName || 'Field'})
                  </option>
                ))}
              </select>

              <select
                className="select-input"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="ALL">All Activity Types</option>
                <option value="LAND_PREPARATION">Land Preparation</option>
                <option value="SOWING">Sowing / Transplantation</option>
                <option value="IRRIGATION">Irrigation / Watering</option>
                <option value="FERTILIZER">Fertilizer Application</option>
                <option value="PEST_CONTROL">Pest / Disease Treatment</option>
                <option value="WEEDING">Weeding</option>
                <option value="HARVESTING">Harvesting</option>
              </select>
            </div>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              Filtered <strong>{filteredRecords.length}</strong> events
            </span>
          </div>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="ui-card">
        <div className="ui-card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date & Type</th>
                  <th>Crop</th>
                  <th>Activity Description</th>
                  <th>Inputs & Dosage</th>
                  <th>Cost (₹)</th>
                  <th>Field Observations</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
                      No cultivation records found. Click "Log Activity" to add one.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => (
                    <tr key={rec.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 20 }}>{getActivityIcon(rec.activityType)}</span>
                          <div>
                            <div style={{ fontWeight: 700 }}>{rec.activityType.replace('_', ' ')}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{rec.activityDate}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{rec.cropName}</strong>
                      </td>
                      <td>{rec.description}</td>
                      <td>
                        {rec.inputsUsed ? (
                          <div>
                            <span>{rec.inputsUsed}</span>
                            {rec.quantityUsed && (
                              <div style={{ fontSize: 11, color: '#64748b' }}>({rec.quantityUsed})</div>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>—</span>
                        )}
                      </td>
                      <td>
                        {rec.costIncurred > 0 ? (
                          <span style={{ fontWeight: 700, color: '#166534' }}>
                            ₹{Number(rec.costIncurred).toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>₹0</span>
                        )}
                      </td>
                      <td style={{ maxWidth: 220, fontSize: 13 }}>
                        {rec.observations || <span style={{ color: '#94a3b8' }}>None</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn-edit-outline"
                            onClick={() => handleOpenEditModal(rec)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-danger-outline"
                            onClick={() => handleDelete(rec.id)}
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

      {/* Modal for Add / Edit Activity */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRecord ? 'Edit Cultivation Log' : 'Log Cultivation Activity'}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Crop *</label>
              <select
                className="form-control"
                value={formData.cropId}
                onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
              >
                {crops.length === 0 && <option value="">No registered crops</option>}
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.cropName} ({c.season})
                  </option>
                ))}
              </select>
              {formErrors.cropId && <div className="form-error">{formErrors.cropId}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Activity Type *</label>
              <select
                className="form-control"
                value={formData.activityType}
                onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
              >
                <option value="LAND_PREPARATION">Land Preparation / Tillage</option>
                <option value="SOWING">Sowing / Transplanting</option>
                <option value="IRRIGATION">Irrigation / Watering</option>
                <option value="FERTILIZER">Fertilizer Application</option>
                <option value="PEST_CONTROL">Pest & Disease Control</option>
                <option value="WEEDING">Weeding / Inter-cultivation</option>
                <option value="HARVESTING">Harvesting & Threshing</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date of Activity *</label>
              <input
                type="date"
                className="form-control"
                value={formData.activityDate}
                onChange={(e) => setFormData({ ...formData, activityDate: e.target.value })}
              />
              {formErrors.activityDate && <div className="form-error">{formErrors.activityDate}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Cost Incurred (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="e.g., 2500"
                value={formData.costIncurred}
                onChange={(e) => setFormData({ ...formData, costIncurred: e.target.value })}
              />
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Description *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Second spray of bio-fungicide or Drip fertigation"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              {formErrors.description && <div className="form-error">{formErrors.description}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Inputs Used</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Urea + DAP or Chlorantraniliprole"
                value={formData.inputsUsed}
                onChange={(e) => setFormData({ ...formData, inputsUsed: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Quantity / Dosage</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., 50 kg / acre or 60 ml / acre"
                value={formData.quantityUsed}
                onChange={(e) => setFormData({ ...formData, quantityUsed: e.target.value })}
              />
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Field Observations & Growth Notes</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Observations on pest pressure, canopy cover, moisture status..."
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
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
              {editingRecord ? 'Save Changes' : 'Record Activity'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
