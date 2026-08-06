import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, Edit3, Trash2, CheckCircle2, XCircle, Search, 
  RefreshCw, Plus, Layers, AlertCircle, Car, Zap, Utensils, 
  ShoppingBag, Truck, Flame, Factory, TreePine, Wind, Plane, 
  Bike, Bus, Train, Trash, Home, Globe, Sun, Package
} from 'lucide-react';

const ICON_OPTIONS = [
  { name: 'Activity', icon: Activity },
  { name: 'Car', icon: Car },
  { name: 'Bus', icon: Bus },
  { name: 'Bike', icon: Bike },
  { name: 'Train', icon: Train },
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
];

const STANDARD_UNITS = ['km', 'kWh', 'meals', 'items', 'Liters', 'kg', 'hours', 'trips'];

const ActivityTypeManagementPage = () => {
  const { showToast } = useAuth();
  const [categories, setCategories] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategoryId, setSelectedCategoryId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    activityCode: '',
    activityName: '',
    description: '',
    unit: 'km',
    minQuantity: 0.1,
    maxQuantity: 5000.0,
    defaultQuantity: 1.0,
    displayOrder: 1,
    icon: 'Activity',
    status: 'ACTIVE',
    remarks: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm Modal
  const [deletingActivity, setDeletingActivity] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, actRes] = await Promise.all([
        api.get('/admin/categories'),
        api.get('/admin/activity-types'),
      ]);
      setCategories(catRes.data || []);
      setActivityTypes(actRes.data || []);
    } catch (err) {
      showToast('Failed to load data: ' + (err.toString() || 'Server error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingActivity(null);
    const defaultCatId = categories.length > 0 ? categories[0].id : '';
    setFormData({
      categoryId: defaultCatId,
      activityCode: '',
      activityName: '',
      description: '',
      unit: 'km',
      minQuantity: 0.1,
      maxQuantity: 5000.0,
      defaultQuantity: 1.0,
      displayOrder: activityTypes.length + 1,
      icon: 'Activity',
      status: 'ACTIVE',
      remarks: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (act) => {
    setEditingActivity(act);
    setFormData({
      categoryId: act.categoryId || '',
      activityCode: act.activityCode || '',
      activityName: act.activityName || '',
      description: act.description || '',
      unit: act.unit || 'km',
      minQuantity: act.minQuantity ?? 0.1,
      maxQuantity: act.maxQuantity ?? 5000.0,
      defaultQuantity: act.defaultQuantity ?? 1.0,
      displayOrder: act.displayOrder ?? 1,
      icon: act.icon || 'Activity',
      status: act.status || 'ACTIVE',
      remarks: act.remarks || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.categoryId) {
      errors.categoryId = 'Category is mandatory';
    }
    if (!formData.activityName || !formData.activityName.trim()) {
      errors.activityName = 'Activity Name is mandatory';
    }
    if (!formData.unit || !formData.unit.trim()) {
      errors.unit = 'Unit is mandatory';
    }
    if (!formData.status) {
      errors.status = 'Status is mandatory';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        categoryId: Number(formData.categoryId),
        minQuantity: Number(formData.minQuantity),
        maxQuantity: Number(formData.maxQuantity),
        defaultQuantity: Number(formData.defaultQuantity),
        displayOrder: Number(formData.displayOrder),
      };

      if (editingActivity) {
        const res = await api.put(`/admin/activity-types/${editingActivity.id}`, payload);
        showToast(res.message || 'Activity Type updated successfully!', 'success');
      } else {
        const res = await api.post('/admin/activity-types', payload);
        showToast(res.message || 'Activity Type created successfully!', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      const msg = typeof err === 'string' ? err : (err?.response?.data?.message || 'Operation failed');
      if (msg.includes('Name')) {
        setFormErrors((prev) => ({ ...prev, activityName: msg }));
      } else if (msg.includes('Code')) {
        setFormErrors((prev) => ({ ...prev, activityCode: msg }));
      } else if (msg.includes('Category')) {
        setFormErrors((prev) => ({ ...prev, categoryId: msg }));
      } else {
        showToast(msg, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (act) => {
    try {
      const res = await api.patch(`/admin/activity-types/${act.id}/status`);
      showToast(res.message || `Activity ${act.activityName} status toggled!`, 'success');
      fetchData();
    } catch (err) {
      showToast('Status update failed: ' + err.toString(), 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingActivity) return;
    try {
      const res = await api.delete(`/admin/activity-types/${deletingActivity.id}`);
      showToast(res.message || 'Activity Type deleted successfully!', 'info');
      setDeletingActivity(null);
      fetchData();
    } catch (err) {
      showToast('Deletion failed: ' + err.toString(), 'error');
    }
  };

  const filteredActivityTypes = activityTypes.filter((act) => {
    const matchesCategory = 
      selectedCategoryId === 'ALL' || String(act.categoryId) === String(selectedCategoryId);

    const matchesSearch = 
      act.activityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.activityCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.categoryName && act.categoryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (act.description && act.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = 
      statusFilter === 'ALL' || act.status === statusFilter;

    return matchesCategory && matchesSearch && matchesStatus;
  });

  const renderIcon = (iconName) => {
    const iconObj = ICON_OPTIONS.find((item) => item.name === iconName);
    const IconComp = iconObj ? iconObj.icon : Activity;
    return <IconComp className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <Activity className="w-7 h-7 text-emerald-400" />
              Activity Type Management (Admin)
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Define sub-activities under each category (e.g., Transport $\rightarrow$ Car, Bus; Food $\rightarrow$ Veg Meal) with units and quantities
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
              <span>Add Activity Type</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-700/60">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Activity Types</div>
            <div className="text-3xl font-black text-white mt-1">{activityTypes.length}</div>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/20">
            <div className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Active Activities</div>
            <div className="text-3xl font-black text-emerald-400 mt-1">
              {activityTypes.filter((a) => a.status === 'ACTIVE').length}
            </div>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-teal-500/20">
            <div className="text-teal-400 text-xs font-semibold uppercase tracking-wider">Categories Covered</div>
            <div className="text-3xl font-black text-teal-400 mt-1">
              {new Set(activityTypes.map((a) => a.categoryId)).size}
            </div>
          </div>
        </div>

        {/* Category Pills & Filters */}
        <div className="space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryId('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedCategoryId === 'ALL'
                  ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-900/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              All Categories ({activityTypes.length})
            </button>

            {categories.map((cat) => {
              const count = activityTypes.filter((a) => a.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                    String(selectedCategoryId) === String(cat.id)
                      ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-900/30'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.colorCode || '#10B981' }} />
                  {cat.categoryName} ({count})
                </button>
              );
            })}
          </div>

          {/* Search & Status Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search activity name, code, category..."
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

        {/* Activity Types Table */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-3" />
              Loading activity types...
            </div>
          ) : filteredActivityTypes.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Activity className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="font-semibold text-slate-300">No activity types found</p>
              <p className="text-xs text-slate-500 mt-1">Try adding a new activity type or adjusting search filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-4 px-5">Code</th>
                    <th className="py-4 px-5">Activity Name</th>
                    <th className="py-4 px-5">Category</th>
                    <th className="py-4 px-5">Unit</th>
                    <th className="py-4 px-5 text-center">Quantities (Min / Max / Default)</th>
                    <th className="py-4 px-5 text-center">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredActivityTypes.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-900 text-emerald-400 border border-slate-700 font-bold">
                          {act.activityCode}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 border border-slate-700">
                            {renderIcon(act.icon)}
                          </div>
                          <div>
                            <div>{act.activityName}</div>
                            {act.description && (
                              <div className="text-xs text-slate-400 font-normal truncate max-w-xs">{act.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 text-slate-200 border border-slate-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          {act.categoryName || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-mono text-xs font-bold text-teal-400">
                        {act.unit}
                      </td>
                      <td className="py-4 px-5 text-center font-mono text-xs text-slate-300">
                        {act.minQuantity ?? 0} / {act.maxQuantity ?? '∞'} / <span className="text-emerald-400 font-bold">{act.defaultQuantity ?? 1}</span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() => handleToggleStatus(act)}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            act.status === 'ACTIVE'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-700/60 hover:bg-rose-900'
                          }`}
                        >
                          {act.status === 'ACTIVE' ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ACTIVE
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              INACTIVE
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(act)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 transition-all"
                            title="Edit Activity Type"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingActivity(act)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400 border border-slate-700 hover:border-rose-800/60 transition-all"
                            title="Delete Activity Type"
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

      {/* Add / Edit Activity Type Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-emerald-400" />
                {editingActivity ? 'Update Activity Type' : 'Add New Activity Type'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-slate-800 border rounded-xl text-sm text-white focus:outline-none ${
                    formErrors.categoryId ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                  }`}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoryName} ({cat.categoryCode})
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && (
                  <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {formErrors.categoryId}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Activity Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Activity Code
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank (e.g. TRANS_CAR)"
                    value={formData.activityCode}
                    onChange={(e) => setFormData({ ...formData, activityCode: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  {formErrors.activityCode && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {formErrors.activityCode}
                    </p>
                  )}
                </div>

                {/* Activity Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Activity Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Car, Bus, Veg Meal"
                    value={formData.activityName}
                    onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                    className={`w-full px-3.5 py-2.5 bg-slate-800 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none ${
                      formErrors.activityName ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                  {formErrors.activityName && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {formErrors.activityName}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Details about this activity..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Unit & Default Icon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Unit of Measurement <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. km, kWh, meals, items"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className={`w-full px-3.5 py-2.5 bg-slate-800 border rounded-xl text-sm text-teal-400 font-mono focus:outline-none ${
                      formErrors.unit ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {STANDARD_UNITS.map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setFormData({ ...formData, unit: u })}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] border border-slate-700"
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                  {formErrors.unit && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {formErrors.unit}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {ICON_OPTIONS.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quantities (Min, Max, Default) */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Min Quantity
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Max Quantity
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.maxQuantity}
                    onChange={(e) => setFormData({ ...formData, maxQuantity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Default Quantity
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.defaultQuantity}
                    onChange={(e) => setFormData({ ...formData, defaultQuantity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Status <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Remarks
                </label>
                <input
                  type="text"
                  placeholder="Optional internal remarks..."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Action buttons */}
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
                  <span>{editingActivity ? 'Save Changes' : 'Create Activity Type'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-7 h-7" />
              <h3 className="text-lg font-bold text-white">Delete Activity Type</h3>
            </div>
            <p className="text-sm text-slate-300">
              Are you sure you want to delete activity type <strong className="text-white">"{deletingActivity.activityName}"</strong> ({deletingActivity.activityCode}) under <strong className="text-emerald-400">{deletingActivity.categoryName}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setDeletingActivity(null)}
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

      <Footer />
    </div>
  );
};

export default ActivityTypeManagementPage;
