import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserDetailModal from '../components/UserDetailModal';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Clock, CheckCircle2, XCircle, RefreshCw, Eye, Check, X, Layers, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailModalUser, setDetailModalUser] = useState(null);
  const [rejectRemark, setRejectRemark] = useState('');
  const [rejectingUserId, setRejectingUserId] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/dashboard');
      setStats(statsRes.data);

      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);
    } catch (err) {
      showToast('Failed to load dashboard data: ' + err.toString(), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await api.post(`/admin/users/${id}/approve`);
      showToast(res.message || 'User approved successfully!', 'success');
      if (detailModalUser && detailModalUser.id === id) {
        setDetailModalUser(null);
      }
      fetchDashboardData();
    } catch (err) {
      showToast('Approval failed: ' + err.toString(), 'error');
    }
  };

  const handleRejectSubmit = async (id) => {
    try {
      const res = await api.post(`/admin/users/${id}/reject`, { remark: rejectRemark });
      showToast(res.message || 'User rejected successfully!', 'info');
      setRejectingUserId(null);
      setRejectRemark('');
      if (detailModalUser && detailModalUser.id === id) {
        setDetailModalUser(null);
      }
      fetchDashboardData();
    } catch (err) {
      showToast('Rejection failed: ' + err.toString(), 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (activeTab === 'PENDING') return u.status === 'PENDING';
    if (activeTab === 'APPROVED') return u.status === 'APPROVED';
    if (activeTab === 'REJECTED') return u.status === 'REJECTED';
    return true;
  });

  // Chart Data
  const pieData = stats ? [
    { name: 'Pending', value: stats.pendingUsers, color: '#f59e0b' },
    { name: 'Approved', value: stats.approvedUsers, color: '#10b981' },
    { name: 'Rejected', value: stats.rejectedUsers, color: '#f43f5e' },
  ] : [];

  const barData = stats ? [
    { name: 'Male', count: stats.maleCount, fill: '#3b82f6' },
    { name: 'Female', count: stats.femaleCount, fill: '#ec4899' },
    { name: 'Other', count: stats.otherGenderCount, fill: '#8b5cf6' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Admin Management Dashboard</h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Review pending registrations, manage user accounts, and track system demographics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/categories"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" /> Categories
            </Link>
            <Link
              to="/admin/activity-types"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-900/30"
            >
              <Activity className="w-3.5 h-3.5" /> Activity Types
            </Link>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
            </button>
          </div>
        </div>

        {/* Dashboard Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Total Registered</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-extrabold text-white">{stats.totalUsers}</span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-amber-900/40 bg-amber-950/20">
              <div className="flex items-center justify-between text-amber-400 mb-2">
                <span className="text-xs font-semibold">Pending Approval</span>
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-2xl font-extrabold text-amber-400">{stats.pendingUsers}</span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20">
              <div className="flex items-center justify-between text-emerald-400 mb-2">
                <span className="text-xs font-semibold">Approved Users</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-2xl font-extrabold text-emerald-400">{stats.approvedUsers}</span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-rose-900/40 bg-rose-950/20">
              <div className="flex items-center justify-between text-rose-400 mb-2">
                <span className="text-xs font-semibold">Rejected Users</span>
                <XCircle className="w-4 h-4" />
              </div>
              <span className="text-2xl font-extrabold text-rose-400">{stats.rejectedUsers}</span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-blue-900/40 bg-blue-950/20">
              <div className="flex items-center justify-between text-blue-400 mb-2">
                <span className="text-xs font-semibold">Male Users</span>
                <Users className="w-4 h-4" />
              </div>
              <span className="text-2xl font-extrabold text-blue-400">{stats.maleCount}</span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-pink-900/40 bg-pink-950/20">
              <div className="flex items-center justify-between text-pink-400 mb-2">
                <span className="text-xs font-semibold">Female Users</span>
                <Users className="w-4 h-4" />
              </div>
              <span className="text-2xl font-extrabold text-pink-400">{stats.femaleCount}</span>
            </div>

          </div>
        )}

        {/* Analytics Charts Section */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Status Pie Chart */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">User Status Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gender Demographic Bar Chart */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Gender Demographics</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis allowDecimals={false} stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* User Management Table */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-white">Registered Users & Applications</h3>
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Applicant Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Mobile</th>
                  <th className="py-3.5 px-4">Gender</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      No users found in <span className="font-semibold text-slate-400">{activeTab}</span> category.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {u.firstName} {u.lastName}
                        {u.username && (
                          <span className="block text-[10px] text-emerald-400 font-mono font-normal">@{u.username}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-mono">{u.email}</td>

                      <td className="py-3.5 px-4 font-mono">{u.mobileNumber}</td>

                      <td className="py-3.5 px-4 capitalize">{u.gender.toLowerCase()}</td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          u.status === 'APPROVED'
                            ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-800/80'
                            : u.status === 'REJECTED'
                            ? 'bg-rose-950/90 text-rose-400 border border-rose-800/80'
                            : 'bg-amber-950/90 text-amber-400 border border-amber-800/80'
                        }`}>
                          {u.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={async () => {
                              try {
                                const fullRes = await api.get(`/admin/users/${u.id}`);
                                setDetailModalUser(fullRes.data);
                              } catch (err) {
                                showToast('Failed to load details', 'error');
                              }
                            }}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {u.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(u.id)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold shadow transition-all"
                                title="Approve & Send Credentials"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>

                              <button
                                onClick={() => setRejectingUserId(u.id)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/60 font-semibold transition-all"
                                title="Reject Application"
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Rejection Remark Modal */}
        {rejectingUserId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
              <h3 className="font-bold text-white text-base">Reject User Application</h3>
              <p className="text-xs text-slate-400">Specify an optional rejection remark to send via email:</p>
              <textarea
                value={rejectRemark}
                onChange={(e) => setRejectRemark(e.target.value)}
                placeholder="e.g. Invalid government ID document provided..."
                className="w-full h-24 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-rose-500"
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setRejectingUserId(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRejectSubmit(rejectingUserId)}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/50"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full Details Modal */}
        {detailModalUser && (
          <UserDetailModal
            user={detailModalUser}
            onClose={() => setDetailModalUser(null)}
            onApprove={handleApprove}
            onReject={(id) => setRejectingUserId(id)}
          />
        )}

      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
