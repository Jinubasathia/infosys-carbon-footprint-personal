import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, Edit3, Trash2, CheckCircle2, XCircle, Search, 
  RefreshCw, Plus, Layers, AlertCircle, Car, Zap, Utensils, 
  ShoppingBag, Truck, Flame, Factory, TreePine, Wind, Plane, 
  Bike, Bus, Train, Trash, Home, Globe, Sun, Package, 
  Leaf, Thermometer, Fuel, Gauge, Calendar
} from 'lucide-react';

const ICON_OPTIONS = [
  { name: 'Activity', icon: Activity },
  { name: 'Car', icon: Car },
  { name: 'Bus', icon: Bus },
  { name: 'Bike', icon: Bike },
  { name: 'Plane', icon: Plane },
  { name: 'Zap', icon: Zap },
  { name: 'Sun', icon: Sun },
  { name: 'Flame', icon: Flame },
  { name: 'Utensils', icon: Utensils },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Package', icon: Package },
  { name: 'Home', icon: Home },
  { name: 'Truck', icon: Truck },
  { name: 'Factory', icon: Factory },
  { name: 'TreePine', icon: TreePine },
  { name: 'Globe', icon: Globe },
  { name: 'Leaf', icon: Leaf },
  { name: 'Thermometer', icon: Thermometer },
  { name: 'Fuel', icon: Fuel },
  { name: 'Gauge', icon: Gauge },
];

const STANDARD_SOURCES = ['IPCC', 'EPA', 'DEFRA', 'IEA', 'Ecoinvent'];

const EmissionFactorManagementPage = () => {
  const { showToast } = useAuth();
  const [activityTypes, setActivityTypes] = useState([]);
  const [emissionFactors, setEmissionFactors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedActivityTypeId, setSelectedActivityTypeId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [factorCategoryId, setFactorCategoryId] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFactor, setEditingFactor] = useState(null);
  const [formData, setFormData] = useState({
    activityTypeId: '',
    emissionFactor: '',
    unit: 'km',
    sourceName: 'IPCC',
    sourceVersion: '',
    effectiveFrom: new Date().toISOString().split('T')[0],
    effectiveTo: '',
    status: 'ACTIVE',
    remarks: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [deletingFactor, setDeletingFactor] = useState(null);

  const asArray = (value) => Array.isArray(value) ? value : [];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [actRes, efRes] = await Promise.all([
        api.get('/admin/activity-types'),
        api.get('/admin/emission-factors'),
      ]);
      // API responses are ApiResponse objects. Never retain a non-array value
      // in render state, even if a proxy/server returns an empty response.
      setActivityTypes(asArray(actRes?.data));
      setEmissionFactors(asArray(efRes?.data));
    } catch (err) {
      setActivityTypes([]);
      setEmissionFactors([]);
      showToast(`Failed to load emission-factor data: ${err?.message || 'Server error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingFactor(null);
    const defaultActId = activityTypes.length > 0 ? activityTypes[0].activityTypeId : '';
    setFormData({
      activityTypeId: defaultActId,
      emissionFactor: '',
      unit: 'km',
      sourceName: 'IPCC',
      sourceVersion: '',
      effectiveFrom: new Date().toISOString().split('T')[0],
      effectiveTo: '',
      status: 'ACTIVE',
      remarks: '',
    });
    setFormErrors({});
    setFactorCategoryId('ALL');
    setIsModalOpen(true);
  };

  const openEditModal = (ef) => {
    setEditingFactor(ef);
    setFormData({
      activityTypeId: ef.activityTypeId || '',
      emissionFactor: ef.emissionFactor || '',
      unit: ef.unit || 'km',
      sourceName: ef.sourceName || 'IPCC',
      sourceVersion: ef.sourceVersion || '',
      effectiveFrom: ef.effectiveFrom || new Date().toISOString().split('T')[0],
      effectiveTo: ef.effectiveTo || '',
      status: ef.status || 'ACTIVE',
      remarks: ef.remarks || '',
    });
    setFormErrors({});
    const matchingActivity = activityTypes.find((activity) => String(activity?.activityTypeId) === String(ef?.activityTypeId));
    setFactorCategoryId(matchingActivity?.categoryId || 'ALL');
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.activityTypeId) errors.activityTypeId = 'Activity type is required';
    if (!formData.emissionFactor || Number(formData.emissionFactor) <= 0)
      errors.emissionFactor = 'Emission factor must be greater than 0';
    if (!formData.unit || !formData.unit.trim()) errors.unit = 'Unit is required';
    if (!formData.sourceName || !formData.sourceName.trim()) errors.sourceName = 'Source name is required';
    if (!formData.effectiveFrom) errors.effectiveFrom = 'Effective from date is required';
    if (formData.effectiveTo && new Date(formData.effectiveTo) < new Date(formData.effectiveFrom))
      errors.effectiveTo = 'Effective To cannot be before Effective From';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const applyBackendErrors = (error) => {
    if (error?.data && typeof error.data === 'object' && !Array.isArray(error.data)) {
      setFormErrors(error.data);
      return true;
    }
    const message = error?.message || 'Unable to save emission factor';
    const lower = message.toLowerCase();
    if (lower.includes('factor')) setFormErrors({ emissionFactor: message });
    else if (lower.includes('activity')) setFormErrors({ activityTypeId: message });
    else if (lower.includes('unit')) setFormErrors({ unit: message });
    else if (lower.includes('source')) setFormErrors({ sourceName: message });
    else if (lower.includes('effective')) setFormErrors({ effectiveFrom: message });
    else return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (editingFactor && !window.confirm('Update this emission factor?')) return;

    setSubmitting(true);
    setFormErrors({});
    try {
      const payload = {
        ...formData,
        activityTypeId: Number(formData.activityTypeId),
        emissionFactor: Number(formData.emissionFactor),
        effectiveFrom: formData.effectiveFrom,
        effectiveTo: formData.effectiveTo || null,
      };

      if (editingFactor) {
        const res = await api.put(`/admin/emission-factors/${editingFactor.emissionFactorId}`, payload);
        showToast(res.message || 'Emission factor updated successfully!', 'success');
      } else {
        const res = await api.post('/admin/emission-factors', payload);
        showToast(res.message || 'Emission factor created successfully!', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      if (!applyBackendErrors(err)) showToast(err?.message || 'Unable to save emission factor. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingFactor) return;
    try {
      const res = await api.delete(`/admin/emission-factors/${deletingFactor.emissionFactorId}`);
      showToast(res.message || 'Emission factor deleted successfully!', 'info');
      setDeletingFactor(null);
      fetchData();
    } catch (err) {
      showToast('Deletion failed: ' + err.toString(), 'error');
    }
  };

  const filteredFactors = asArray(emissionFactors).filter((ef) => {
    if (!ef || typeof ef !== 'object') return false;
    const matchesActivity = selectedActivityTypeId === 'ALL' || String(ef.activityTypeId) === String(selectedActivityTypeId);
    const matchesSearch = 
      ef.activityTypeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ef.sourceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ef.remarks?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || ef.status === statusFilter;
    return matchesActivity && matchesSearch && matchesStatus;
  });

  const renderIcon = (iconName) => {
    const iconObj = ICON_OPTIONS.find((item) => item.name === iconName);
    const Icon = iconObj ? iconObj.icon : Activity;
    return <Icon className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <Leaf className="w-7 h-7 text-emerald-400" />
              Emission Factor Management (Admin)
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Configure emission factors for each activity type (e.g., Car: 0.21 kg CO₂e/km)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-900/30"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Emission Factor</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-700/60">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Factors</div>
            <div className="text-3xl font-black text-white mt-1">{asArray(emissionFactors).length}</div>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/20">
            <div className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Active Factors</div>
            <div className="text-3xl font-black text-emerald-400 mt-1">
              {asArray(emissionFactors).filter((e) => e?.status === 'ACTIVE').length}
            </div>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-teal-500/20">
            <div className="text-teal-400 text-xs font-semibold uppercase tracking-wider">Activity Types</div>
            <div className="text-3xl font-black text-teal-400 mt-1">
              {asArray(activityTypes).length}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
            <button
              onClick={() => setSelectedActivityTypeId('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedActivityTypeId === 'ALL'
                  ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-900/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              All Activity Types ({asArray(activityTypes).length})
            </button>
            {asArray(activityTypes).filter(Boolean).map((act) => (
              <button
                key={act.activityTypeId}
                onClick={() => setSelectedActivityTypeId(act.activityTypeId)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  String(selectedActivityTypeId) === String(act.activityTypeId)
                    ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-900/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {act.activityName} ({act.categoryName})
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search activity, source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {['ALL', 'ACTIVE', 'INACTIVE'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-emerald-600 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-3" />
              Loading emission factors...
            </div>
          ) : filteredFactors.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Leaf className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="font-semibold text-slate-300">No emission factors found</p>
              <p className="text-xs text-slate-500 mt-1">Add emission factors for activity types to enable carbon calculations.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-4 px-5">Activity</th>
                    <th className="py-4 px-5">Factor</th>
                    <th className="py-4 px-5">Unit</th>
                    <th className="py-4 px-5">Source</th>
                    <th className="py-4 px-5">Effective From</th>
                    <th className="py-4 px-5 text-center">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredFactors.map((ef) => (
                    <tr key={ef.emissionFactorId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 border border-slate-700">
                            {renderIcon(ef.activityTypeName?.split(' ')[0] || 'Activity')}
                          </div>
                          <div>
                            <div>{ef.activityTypeName}</div>
                            <div className="text-xs text-slate-400">{ef.categoryName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-mono text-emerald-400 font-bold">
                        {ef.emissionFactor}
                      </td>
                      <td className="py-4 px-5 font-mono text-xs text-teal-400">{ef.unit}</td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 text-slate-200 border border-slate-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          {ef.sourceName}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-mono text-xs text-slate-300">
                        {ef.effectiveFrom}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          ef.status === 'ACTIVE'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-700/60'
                        }`}>
                          {ef.status === 'ACTIVE' ? (
                            <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ACTIVE</>
                          ) : (
                            <><XCircle className="w-3.5 h-3.5 text-rose-400" /> INACTIVE</>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(ef)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 transition-all"
                            title="Edit Factor"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingFactor(ef)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400 border border-slate-700 hover:border-rose-800/60 transition-all"
                            title="Delete Factor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <Leaf className="w-5 h-5 text-emerald-400" />
                {editingFactor ? 'Update Emission Factor' : 'Add New Emission Factor'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3 text-xs text-teal-100"><span className="font-bold text-teal-300">How it is used:</span> Carbon emission = quantity × emission factor. The server applies the active factor for the activity date.</div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">1. Select Category</label>
                <select value={factorCategoryId} onChange={(e) => { setFactorCategoryId(e.target.value); setFormData({ ...formData, activityTypeId: '' }); }} className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"><option value="ALL">All categories</option>{[...new Map(asArray(activityTypes).filter(Boolean).map((a) => [a.categoryId, a])).values()].map((a) => <option key={a.categoryId} value={a.categoryId}>{a.categoryName || `Category ${a.categoryId}`}</option>)}</select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  2. Select Activity Type <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.activityTypeId}
                  onChange={(e) => setFormData({ ...formData, activityTypeId: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-slate-800 border rounded-xl text-sm text-white focus:outline-none ${
                    formErrors.activityTypeId ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                  }`}
                >
                  <option value="">-- Select Activity Type --</option>
                  {asArray(activityTypes).filter((act) => act && (factorCategoryId === 'ALL' || String(act.categoryId) === String(factorCategoryId))).map((act) => (
                    <option key={act.activityTypeId} value={act.activityTypeId}>
                      {act.activityName} ({act.categoryName})
                    </option>
                  ))}
                </select>
                {formErrors.activityTypeId && (
                  <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {formErrors.activityTypeId}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Emission Factor <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="e.g. 0.21"
                    value={formData.emissionFactor}
                    onChange={(e) => setFormData({ ...formData, emissionFactor: e.target.value })}
                    className={`w-full px-3.5 py-2.5 bg-slate-800 border rounded-xl text-sm text-white focus:outline-none ${
                      formErrors.emissionFactor ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                  {formErrors.emissionFactor && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {formErrors.emissionFactor}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Unit <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. km, kWh"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className={`w-full px-3.5 py-2.5 bg-slate-800 border rounded-xl text-sm text-teal-400 font-mono focus:outline-none ${
                      formErrors.unit ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                  {formErrors.unit && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {formErrors.unit}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Source Name <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.sourceName}
                    onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                    className={`w-full px-3.5 py-2.5 bg-slate-800 border rounded-xl text-sm text-white focus:outline-none ${formErrors.sourceName ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'}`}
                  >
                    {STANDARD_SOURCES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {formErrors.sourceName && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {formErrors.sourceName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Source Version
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2021, v4.0"
                    value={formData.sourceVersion}
                    onChange={(e) => setFormData({ ...formData, sourceVersion: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Effective From <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.effectiveFrom}
                    onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                    className={`w-full px-3.5 py-2.5 bg-slate-800 border rounded-xl text-sm text-white focus:outline-none ${
                      formErrors.effectiveFrom ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                  {formErrors.effectiveFrom && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {formErrors.effectiveFrom}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Effective To (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.effectiveTo}
                    onChange={(e) => setFormData({ ...formData, effectiveTo: e.target.value })}
                    className={`w-full px-3.5 py-2.5 bg-slate-800 border rounded-xl text-sm text-white focus:outline-none ${
                      formErrors.effectiveTo ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                  {formErrors.effectiveTo && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {formErrors.effectiveTo}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Status <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-slate-800 border rounded-xl text-sm text-white focus:outline-none ${formErrors.sourceName ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'}`}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Remarks
                </label>
                <input
                  type="text"
                  placeholder="Optional notes..."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-900/30"
                >
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                  <span>{editingFactor ? 'Save Changes' : 'Create Factor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingFactor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-7 h-7" />
              <h3 className="text-lg font-bold text-white">Delete Emission Factor</h3>
            </div>
            <p className="text-sm text-slate-300">
              Are you sure you want to delete emission factor <strong className="text-white">{deletingFactor.emissionFactor}</strong> for <strong className="text-emerald-400">{deletingFactor.activityTypeName}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setDeletingFactor(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-all shadow-lg shadow-rose-900/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmissionFactorManagementPage;
