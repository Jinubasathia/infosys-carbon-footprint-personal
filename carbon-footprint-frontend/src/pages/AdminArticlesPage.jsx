import React, { useEffect, useState, useCallback, useRef } from 'react';
import api from '../api/axios';
import { BookOpen, Plus, Edit3, Trash2, Eye, EyeOff, Globe, RefreshCw, X, AlertCircle, Save, Upload, ImageIcon } from 'lucide-react';

const EMPTY_FORM = { title: '', shortDescription: '', content: '', category: '', status: 'DRAFT', visibleToUsers: false };
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp'];

function statusBadge(status) {
  if (status === 'PUBLISHED') return 'bg-emerald-950 text-emerald-400 border border-emerald-800';
  if (status === 'HIDDEN') return 'bg-slate-800 text-slate-400 border border-slate-700';
  return 'bg-amber-950 text-amber-400 border border-amber-800';
}

// Shared fallback-aware image used in preview modal
function SafeImg({ src, alt, className }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className={`bg-gradient-to-br from-emerald-900/40 to-teal-900/40 flex flex-col items-center justify-center gap-2 ${className}`}>
        <BookOpen className="h-10 w-10 text-emerald-700" />
        {err && <span className="text-xs text-slate-500">Image unavailable</span>}
      </div>
    );
  }
  return <img src={src} alt={alt} className={`object-cover ${className}`} onError={() => setErr(true)} />;
}

// Image picker used inside the create/edit form
function ImagePicker({ existingUrl, onFileChange, imageError, setImageError }) {
  const inputRef = useRef(null);
  const [localPreview, setLocalPreview] = useState(null); // object URL for newly selected file
  const [fileName, setFileName] = useState('');

  const validate = (file) => {
    if (!file) return 'Please select an image.';
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXT.includes(ext) || !ALLOWED_TYPES.includes(file.type.toLowerCase()))
      return 'Only JPG, JPEG, PNG and WEBP images are allowed.';
    if (file.size > MAX_BYTES) return 'Image size must be less than 5 MB.';
    return null;
  };

  const handleFile = (file) => {
    const err = validate(file);
    if (err) { setImageError(err); onFileChange(null); setLocalPreview(null); setFileName(''); return; }
    setImageError(null);
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    onFileChange(file);
  };

  const onInputChange = (e) => { const f = e.target.files?.[0]; if (f) handleFile(f); };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const previewSrc = localPreview || existingUrl || null;
  const hasExisting = !!existingUrl && !localPreview;

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300">
        Cover Image <span className="text-slate-500 font-normal">(JPG, PNG, WEBP · max 5 MB)</span>
      </label>

      {/* Drop zone / preview area */}
      <div
        className="relative overflow-hidden rounded-xl border-2 border-dashed border-slate-600 hover:border-emerald-500/60 transition-colors cursor-pointer"
        style={{ minHeight: '10rem' }}
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
      >
        {previewSrc ? (
          <>
            <img
              src={previewSrc}
              alt="Cover preview"
              className="w-full h-40 object-cover"
              onError={() => { if (localPreview) { setLocalPreview(null); } }}
            />
            <div className="absolute inset-0 bg-slate-950/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Upload className="h-5 w-5 text-white" />
              <span className="text-sm font-semibold text-white">
                {hasExisting ? 'Replace Image' : 'Change Image'}
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
            <div className="rounded-full bg-slate-800 p-3">
              <ImageIcon className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300">Click or drag to upload</p>
              <p className="text-xs text-slate-500 mt-0.5">JPG, PNG, WEBP up to 5 MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Status row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {fileName && (
            <span className="text-xs text-emerald-400 truncate">✓ {fileName}</span>
          )}
          {hasExisting && !fileName && (
            <span className="text-xs text-slate-500 truncate">Current image saved</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="shrink-0 flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:border-slate-500"
        >
          <Upload className="h-3.5 w-3.5" />
          {previewSrc ? 'Choose Another' : 'Choose Image'}
        </button>
      </div>

      {imageError && (
        <p className="flex items-center gap-1 text-xs text-rose-400">
          <AlertCircle className="h-3 w-3 shrink-0" />{imageError}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get('/articles/admin/all').then(r => setArticles(r.data || [])).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null); setForm(EMPTY_FORM); setImageFile(null); setImageError(null); setErrors({}); setShowForm(true);
  };
  const openEdit = (a) => {
    setEditing(a);
    setForm({ title: a.title, shortDescription: a.shortDescription, content: a.content, category: a.category, status: a.status, visibleToUsers: a.visibleToUsers });
    setImageFile(null); setImageError(null); setErrors({}); setShowForm(true);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.shortDescription.trim()) e.shortDescription = 'Short description is required.';
    if (!form.content.trim()) e.content = 'Content is required.';
    if (!form.category.trim()) e.category = 'Category is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (e) => {
    e.preventDefault();
    if (!validate() || imageError) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('shortDescription', form.shortDescription);
      fd.append('content', form.content);
      fd.append('category', form.category);
      fd.append('status', form.status);
      fd.append('visibleToUsers', form.visibleToUsers);
      if (imageFile) fd.append('image', imageFile);

      if (editing) await api.put(`/articles/admin/${editing.id}`, fd);
      else await api.post('/articles/admin', fd);

      setShowForm(false);
      load();
    } catch (err) {
      setErrors({ general: err?.message || 'Failed to save article.' });
    } finally { setSaving(false); }
  };

  const publish = async (id) => { await api.put(`/articles/admin/${id}/publish`); load(); };
  const unpublish = async (id) => { await api.put(`/articles/admin/${id}/unpublish`); load(); };
  const remove = async (id) => { if (!window.confirm('Delete this article?')) return; await api.delete(`/articles/admin/${id}`); load(); };

  const field = (key, label, type = 'text', required = false) => (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1">{label}{required && <span className="text-rose-400 ml-1">*</span>}</label>
      {type === 'textarea' ? (
        <textarea rows={6} value={form[key]} onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: undefined })); }}
          className={`w-full rounded-lg border bg-slate-900 p-2.5 text-sm text-white focus:outline-none resize-y ${errors[key] ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'}`} />
      ) : (
        <input type={type} value={form[key]} onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: undefined })); }}
          className={`w-full rounded-lg border bg-slate-900 p-2.5 text-sm text-white focus:outline-none ${errors[key] ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'}`} />
      )}
      {errors[key] && <p className="mt-1 text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors[key]}</p>}
    </div>
  );

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-5 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Articles</h1>
          <p className="text-sm text-slate-400">Create and manage sustainability articles for users.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="rounded-lg border border-slate-700 bg-slate-800 p-2 hover:bg-slate-700"><RefreshCw className="h-4 w-4 text-slate-300" /></button>
          <button onClick={openCreate} className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 font-bold text-slate-950 hover:bg-emerald-400">
            <Plus className="h-4 w-4" />New Article
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <section className="rounded-2xl border border-slate-700 bg-slate-800/50 overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-slate-400">Loading…</p>
        ) : articles.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/70 text-xs uppercase text-slate-400">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Visible</th>
                  <th className="p-4">Author</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {articles.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/40">
                    <td className="p-4">
                      <p className="font-semibold text-white line-clamp-1">{a.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{a.shortDescription}</p>
                    </td>
                    <td className="p-4 text-slate-300">{a.category}</td>
                    <td className="p-4"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusBadge(a.status)}`}>{a.status}</span></td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${a.visibleToUsers ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                        {a.visibleToUsers ? 'YES' : 'NO'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-xs">{a.author}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setPreview(a)} title="Preview" className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => openEdit(a)} title="Edit" className="rounded-lg bg-slate-800 p-1.5 text-teal-400 hover:bg-slate-700"><Edit3 className="h-4 w-4" /></button>
                        {a.status !== 'PUBLISHED' ? (
                          <button onClick={() => publish(a.id)} title="Publish" className="rounded-lg bg-emerald-950/60 p-1.5 text-emerald-400 hover:bg-emerald-900/60"><Globe className="h-4 w-4" /></button>
                        ) : (
                          <button onClick={() => unpublish(a.id)} title="Unpublish" className="rounded-lg bg-slate-800 p-1.5 text-amber-400 hover:bg-slate-700"><EyeOff className="h-4 w-4" /></button>
                        )}
                        <button onClick={() => remove(a.id)} title="Delete" className="rounded-lg bg-rose-950/60 p-1.5 text-rose-400 hover:bg-rose-900/60"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-8 text-center text-slate-400">No articles yet. Create your first article.</p>
        )}
      </section>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 p-5">
              <h2 className="font-bold text-white">{editing ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-slate-400 hover:text-white" /></button>
            </div>
            <form onSubmit={save} className="space-y-4 p-5">
              {field('title', 'Title', 'text', true)}
              {field('category', 'Category', 'text', true)}
              {field('shortDescription', 'Short Description', 'text', true)}
              {field('content', 'Article Content', 'textarea', true)}

              <ImagePicker
                existingUrl={editing?.coverImage || null}
                onFileChange={setImageFile}
                imageError={imageError}
                setImageError={setImageError}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="HIDDEN">Hidden</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer pb-2.5">
                    <input type="checkbox" checked={form.visibleToUsers} onChange={e => setForm(f => ({ ...f, visibleToUsers: e.target.checked }))} className="rounded" />
                    Visible to Users
                  </label>
                </div>
              </div>
              {errors.general && <p className="text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.general}</p>}
              <div className="flex justify-end gap-3 border-t border-slate-700 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
                  <Save className="h-4 w-4" />{saving ? 'Saving…' : editing ? 'Update Article' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 p-5">
              <h2 className="font-bold text-white">Article Preview</h2>
              <button onClick={() => setPreview(null)}><X className="h-5 w-5 text-slate-400 hover:text-white" /></button>
            </div>
            <div className="p-5 space-y-3">
              <SafeImg src={preview.coverImage} alt={preview.title} className="w-full rounded-xl max-h-48" />
              <span className="text-xs font-bold text-emerald-400 uppercase">{preview.category}</span>
              <h3 className="text-xl font-extrabold text-white">{preview.title}</h3>
              <p className="text-sm text-slate-400">{preview.shortDescription}</p>
              <div className="border-t border-slate-700 pt-3">
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{preview.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
