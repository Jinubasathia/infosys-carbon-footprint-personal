import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { Gauge, Save, Trash2, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminEmissionLimitsPage() {
  const [limits, setLimits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ categoryId: '', monthlyLimit: '', active: true });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [limRes, catRes] = await Promise.all([
      api.get('/admin/emission-limits').catch(() => ({ data: [] })),
      api.get('/admin/categories').catch(() => ({ data: [] })),
    ]);
    setLimits(limRes.data || []);
    setCategories(catRes.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const validate = () => {
    const e = {};
    if (!form.categoryId) e.categoryId = 'Select a category.';
    if (!form.monthlyLimit || Number(form.monthlyLimit) <= 0) e.monthlyLimit = 'Limit must be greater than 0.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true); setMsg('');
    try {
      await api.post('/admin/emission-limits', {
        categoryId: Number(form.categoryId),
        monthlyLimit: Number(form.monthlyLimit),
        active: form.active,
      });
      setMsg('Emission limit saved.');
      setForm({ categoryId: '', monthlyLimit: '', active: true });
      setErrors({});
      load();
    } catch (err) {
      setErrors({ general: err?.message || 'Failed to save.' });
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this emission limit?')) return;
    await api.delete(`/admin/emission-limits/${id}`);
    load();
  };

  const existingCategoryIds = new Set(limits.map(l => String(l.categoryId)));
  const availableCategories = categories.filter(c => !existingCategoryIds.has(String(c.categoryId)));

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-5 py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Emission Limits</h1>
        <p className="text-sm text-slate-400">Configure monthly category emission limits. Warnings are triggered when users exceed these thresholds.</p>
      </div>

      {/* Add Form */}
      <section className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
        <h2 className="font-bold text-white mb-4">Add / Update Limit</h2>
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
            <select
              value={form.categoryId}
              onChange={e => { setForm(f => ({ ...f, categoryId: e.target.value })); setErrors({}); }}
              className={`w-full rounded-lg border bg-slate-900 p-2.5 text-sm text-white focus:outline-none ${errors.categoryId ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'}`}
            >
              <option value="">-- Select Category --</option>
              {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
            </select>
            {errors.categoryId && <p className="mt-1 text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.categoryId}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Limit (kg CO2e) *</label>
            <input
              type="number" min="0.01" step="0.01" value={form.monthlyLimit}
              onChange={e => { setForm(f => ({ ...f, monthlyLimit: e.target.value })); setErrors({}); }}
              className={`w-full rounded-lg border bg-slate-900 p-2.5 text-sm text-white focus:outline-none ${errors.monthlyLimit ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'}`}
              placeholder="e.g. 10.00"
            />
            {errors.monthlyLimit && <p className="mt-1 text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.monthlyLimit}</p>}
          </div>
          <div className="flex flex-col justify-end gap-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="rounded" />
              Active
            </label>
            <button type="submit" disabled={saving} className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2.5 font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
              <Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save Limit'}
            </button>
          </div>
        </form>
        {errors.general && <p className="mt-2 text-xs text-rose-400">{errors.general}</p>}
        {msg && <p className="mt-2 text-xs text-emerald-300">{msg}</p>}
      </section>

      {/* Limits Table */}
      <section className="rounded-2xl border border-slate-700 bg-slate-800/50 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-700 p-5">
          <h2 className="font-bold text-white">Configured Limits</h2>
          <button onClick={load} className="rounded-lg border border-slate-700 bg-slate-800 p-2 hover:bg-slate-700">
            <RefreshCw className="h-4 w-4 text-slate-300" />
          </button>
        </div>
        {loading ? (
          <p className="p-6 text-slate-400">Loading…</p>
        ) : limits.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/70 text-xs uppercase text-slate-400">
                <tr>
                  <th className="p-4">Category</th>
                  <th className="p-4">Monthly Limit</th>
                  <th className="p-4">Unit</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {limits.map(l => (
                  <tr key={l.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-semibold text-white">{l.categoryName}</td>
                    <td className="p-4 font-mono text-emerald-400">{l.monthlyLimit}</td>
                    <td className="p-4 text-slate-400">{l.unit}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${l.active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                        {l.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => remove(l.id)} className="rounded-lg bg-rose-950/60 p-2 text-rose-400 hover:bg-rose-900/60">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-8 text-center text-slate-400">No emission limits configured yet.</p>
        )}
      </section>
    </main>
  );
}
