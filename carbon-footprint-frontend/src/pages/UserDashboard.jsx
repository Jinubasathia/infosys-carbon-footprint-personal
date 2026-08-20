import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, Leaf, CalendarDays, CalendarRange, Activity, Layers, Target, TrendingUp, Flame, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';

const colors = ['#10b981', '#38bdf8', '#a78bfa', '#f59e0b', '#f43f5e', '#14b8a6'];
const val = x => Number(x || 0);
const kg = x => `${val(x).toFixed(2)} kg CO2e`;

function aggregate(logs) {
  const now = new Date(), today = now.toISOString().slice(0, 10), month = today.slice(0, 7), year = today.slice(0, 4);
  const group = (key, name) => Object.values(logs.reduce((a, l) => {
    const k = key(l); a[k] ??= { key: k, name: name(l), emission: 0, activities: 0 };
    a[k].emission += val(l.totalEmission); a[k].activities++; return a;
  }, {})).sort((a, b) => a.key.localeCompare(b.key));
  const total = logs.reduce((s, l) => s + val(l.totalEmission), 0);
  const cats = group(l => String(l.categoryId || l.categoryName), l => l.categoryName || 'Other').sort((a, b) => b.emission - a.emission);
  return {
    total,
    today: logs.filter(l => l.activityDate === today).reduce((s, l) => s + val(l.totalEmission), 0),
    month: logs.filter(l => l.activityDate?.startsWith(month)).reduce((s, l) => s + val(l.totalEmission), 0),
    year: logs.filter(l => l.activityDate?.startsWith(year)).reduce((s, l) => s + val(l.totalEmission), 0),
    activities: logs.length,
    cats: cats.map(c => ({ ...c, percent: total ? c.emission / total * 100 : 0 })),
    daily: group(l => l.activityDate, l => l.activityDate),
    monthly: group(l => l.activityDate.slice(0, 7), l => new Date(`${l.activityDate.slice(0, 7)}-01`).toLocaleString('en', { month: 'short', year: '2-digit' })),
    yearly: group(l => l.activityDate.slice(0, 4), l => l.activityDate.slice(0, 4)),
    average: logs.length ? total / logs.length : 0,
  };
}

const Card = ({ label, value, icon: Icon }) => (
  <div className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4">
    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
      <span>{label}</span><Icon className="h-4 w-4 text-emerald-400" />
    </div>
    <p className="mt-3 text-xl font-black text-white">{value}</p>
  </div>
);

const Chart = ({ title, data, type = 'line' }) => (
  <section className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-5">
    <h2 className="mb-4 font-bold text-white">{title}</h2>
    {data.length ? (
      <div className="h-72">
        <ResponsiveContainer>
          {type === 'bar'
            ? <BarChart data={data}><XAxis dataKey="name" stroke="#94a3b8" fontSize={11} /><YAxis stroke="#94a3b8" fontSize={11} /><Tooltip formatter={v => [`${val(v).toFixed(2)} kg CO2e`, 'Emission']} /><Bar dataKey="emission" fill="#10b981" radius={[6, 6, 0, 0]} /></BarChart>
            : <LineChart data={data}><XAxis dataKey="name" stroke="#94a3b8" fontSize={11} /><YAxis stroke="#94a3b8" fontSize={11} /><Tooltip formatter={v => [`${val(v).toFixed(2)} kg CO2e`, 'Emission']} /><Line type="monotone" dataKey="emission" stroke="#38bdf8" strokeWidth={3} dot={{ r: 3 }} /></LineChart>
          }
        </ResponsiveContainer>
      </div>
    ) : <p className="py-20 text-center text-sm text-slate-400">No activity data available yet.</p>}
  </section>
);

export function AnalyticsContent({ reports = false }) {
  const { showWarning } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('month');
  const [goal, setGoal] = useState(null);
  // Server-calculated streak and sustainability score.
  const [summary, setSummary] = useState(null);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const r = await api.get('/user/activities');
      setLogs(r.data || []);
      if (!reports) {
        const currentAlert = await api.get('/user/alerts/current-goal');
        if (currentAlert.data) showWarning(currentAlert.data);
      }
    } catch { setError('Unable to load analytics. Please try again.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { api.get('/user/goals/current').then(r => setGoal(r.data)).catch(() => {}); }, []);
  useEffect(() => {
    if (reports) return;
    api.get('/user/alerts/current-goal').then(r => {
      if (r.data) showWarning(r.data);
    }).catch(() => {});
  }, [reports, showWarning]);
  // Re-fetch summary whenever logs change so streak/score stay in sync after new activity
  useEffect(() => {
    api.get('/user/dashboard/summary').then(r => setSummary(r.data)).catch(() => {});
  }, [logs]);

  const a = useMemo(() => aggregate(logs), [logs]);

  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  const previousKey = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, '0')}`;
  const previousEmission = logs.filter(l => l.activityDate?.startsWith(previousKey)).reduce((sum, l) => sum + val(l.totalEmission), 0);
  const change = previousEmission ? ((a.month - previousEmission) / previousEmission) * 100 : null;

  // Use server-calculated streak (correct LocalDate arithmetic, no JS timezone issues)
  const streak = summary?.trackingStreak ?? 0;

  // Sustainability score from server
  const score = summary?.sustainabilityScore ?? 0;
  const scoreStatus = summary?.sustainabilityStatus ?? '';
  const hasActivities = summary?.hasActivities ?? false;
  const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-teal-400' : score >= 40 ? 'text-amber-400' : 'text-rose-400';
  const scoreBarColor = score >= 80 ? 'bg-emerald-400' : score >= 60 ? 'bg-teal-400' : score >= 40 ? 'bg-amber-400' : 'bg-rose-500';

  const insight = a.cats.length
    ? `${a.cats[0].name} is your largest emission source based on your recorded activities.`
    : 'Log activities to receive personalized sustainability insights.';
  const actions = {
    transport: ['Try public transport or carpooling.', 'Walk or cycle for short journeys.'],
    electricity: ['Switch off unused appliances.', 'Choose energy-efficient devices.'],
    food: ['Reduce food waste.', 'Choose more lower-emission meals.'],
    shopping: ['Reuse products where possible.', 'Plan purchases to avoid unnecessary items.'],
  };
  const rec = actions[(a.cats[0]?.name || '').toLowerCase()] || ['Keep tracking activities to discover tailored actions.'];
  const trend = period === 'day' ? a.daily : period === 'year' ? a.yearly : a.monthly;

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-8 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">{reports ? 'Reports & Analytics' : 'Carbon Footprint Dashboard'}</h1>
          <p className="mt-1 text-sm text-slate-400">Insights calculated from your recorded activities.</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-sm text-rose-200">
          {error} <button onClick={load} className="underline">Retry</button>
        </div>
      ) : loading ? (
        <div className="py-24 text-center text-slate-400">
          <RefreshCw className="mx-auto mb-3 h-7 w-7 animate-spin text-emerald-400" />Loading analytics...</div>
      ) : (
        <>
          {/* Summary stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card label="Total Footprint" value={kg(a.total)} icon={Leaf} />
            <Card label="Today's Emission" value={kg(a.today)} icon={CalendarDays} />
            <Card label="This Month" value={kg(a.month)} icon={CalendarRange} />
            <Card label="This Year" value={kg(a.year)} icon={TrendingUp} />
            <Card label="Total Activities" value={a.activities} icon={Activity} />
            <Card label="Categories Used" value={a.cats.length} icon={Layers} />
            <Card label="Average per Activity" value={kg(a.average)} icon={Target} />
            <Card label="Primary Driver" value={a.cats[0]?.name || 'No category yet'} icon={TrendingUp} />
          </div>

          {/* Period selector */}
          <div className="flex gap-2 rounded-xl border border-slate-700 bg-slate-800 p-1 w-fit">
            {['day', 'month', 'year'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`rounded-lg px-4 py-2 text-xs font-bold capitalize ${period === p ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>
                {p}
              </button>
            ))}
          </div>

          {/* 4-card insight row */}
          <section className="grid gap-4 lg:grid-cols-4">

            {/* Tracking Streak (server-calculated) */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-5">
              <p className="text-xs font-bold uppercase text-slate-400">Tracking Streak</p>
              <p className="mt-2 flex items-center gap-2 text-2xl font-black text-white"><Flame className="h-6 w-6 text-amber-400" />{streak} day{streak === 1 ? '' : 's'}</p>
              <p className="mt-1 text-xs text-slate-400">
                {streak > 0 ? 'Consecutive days with activity logs.' : 'No activity streak yet.'}
              </p>
            </div>

            {/* Compared with last month */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-5">
              <p className="text-xs font-bold uppercase text-slate-400">Compared With Last Month</p>
              <p className="mt-2 font-bold text-white">{kg(a.month)}</p>
              <p className={`text-sm ${change !== null && change > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {change === null ? 'No previous-month data' : <span className="inline-flex items-center gap-1">{change > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}{Math.abs(change).toFixed(1)}% vs {kg(previousEmission)}</span>}
              </p>
            </div>

            {/* Sustainability Score (server-calculated) */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-5">
              <p className="text-xs font-bold uppercase text-slate-400">Sustainability Score</p>
              {hasActivities ? (
                <>
                  <p className={`mt-2 text-2xl font-black ${scoreColor}`}>{score} / 100</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
                    <div className={`h-full rounded-full transition-all ${scoreBarColor}`} style={{ width: `${score}%` }} />
                  </div>
                  <p className={`mt-1 text-xs font-semibold ${scoreColor}`}>{scoreStatus}</p>
                </>
              ) : (
                <>
                  <p className="mt-2 text-2xl font-black text-slate-500">No score yet</p>
                  <p className="mt-1 text-xs text-slate-400">Log activities to see your score.</p>
                </>
              )}
            </div>

            {/* Monthly Goal */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-5">
              <p className="text-xs font-bold uppercase text-slate-400">Monthly Goal</p>
              {goal ? (
                <>
                  <p className="mt-2 font-bold text-white">{kg(a.month)} / {kg(goal.targetAmount)}</p>
                  <div className="mt-2 h-2 overflow-hidden rounded bg-slate-700">
                    <div className={`h-full ${goal.currentEmission > goal.targetAmount ? 'bg-rose-400' : 'bg-emerald-400'}`}
                      style={{ width: `${Math.min(100, a.month / (goal.targetAmount || 1) * 100)}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {a.month > goal.targetAmount ? 'Target exceeded' : `${(a.month / goal.targetAmount * 100).toFixed(0)}% of monthly goal`}
                  </p>
                  <Link to="/user/goals" className="mt-2 block text-xs text-emerald-400 hover:underline">View Goal <ArrowRight className="inline h-3.5 w-3.5" /></Link>
                </>
              ) : (
                <div className="mt-2">
                  <p className="text-xs text-slate-400">No monthly goal set.</p>
                  <Link to="/user/goals" className="mt-2 block text-xs text-emerald-400 hover:underline">Set Monthly Goal <ArrowRight className="inline h-3.5 w-3.5" /></Link>
                </div>
              )}
            </div>
          </section>

          {/* Insights + recommendations */}
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-5">
              <h2 className="font-bold text-white">Smart Sustainability Insight</h2>
              <p className="mt-3 text-sm text-slate-300">{insight}</p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-5">
              <h2 className="font-bold text-white">Recommended Actions</h2>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-300">
                {rec.map(x => <li key={x}>{x}</li>)}
              </ul>
            </div>
          </section>

          {/* Quick links */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[['Log Activity', '/user/activities'], ['View History', '/user/history'], ['Reports', '/user/reports'], ['My Profile', '/user/profile']].map(([label, to]) => (
              <Link key={to} to={to} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm font-bold text-emerald-300 hover:bg-emerald-500/20">{label}</Link>
            ))}
          </section>

          <Chart title={`${period[0].toUpperCase() + period.slice(1)} Carbon Footprint`} data={trend} type={period === 'day' ? 'line' : 'bar'} />

          <div className="grid gap-6 lg:grid-cols-2">
            <Chart title="Monthly Carbon Footprint Trend" data={a.daily.filter(x => x.key.startsWith(new Date().toISOString().slice(0, 7)))} type="line" />
            <section className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-5">
              <h2 className="font-bold text-white">Emissions Distribution by Category</h2>
              {a.cats.length ? (
                <>
                  <div className="h-64">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={a.cats} dataKey="emission" nameKey="name" innerRadius="55%" outerRadius="80%">
                          {a.cats.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                        </Pie>
                        <Tooltip formatter={v => kg(v)} /><Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {a.cats.map((c, i) => (
                      <div key={c.key} className="flex justify-between rounded-lg bg-slate-900/60 px-3 py-2 text-xs">
                        <span style={{ color: colors[i % colors.length] }}>{c.name}</span>
                        <span>{kg(c.emission)} &middot; {c.percent.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : <p className="py-20 text-center text-sm text-slate-400">No activity data available yet.</p>}
            </section>
          </div>

          <Chart title="Yearly Carbon Footprint" data={a.monthly.filter(x => x.key.startsWith(String(new Date().getFullYear())))} type="bar" />

          {/* Recent logs / category breakdown table */}
          <section className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-800/50">
            <div className="flex items-center justify-between border-b border-slate-700 p-5">
              <h2 className="font-bold text-white">{reports ? 'Detailed Category Breakdown' : 'Recent Activity Logs'}</h2>
              {!reports && <Link className="text-sm font-semibold text-emerald-400" to="/user/history">View Full History <ArrowRight className="inline h-3.5 w-3.5" /></Link>}
            </div>
            {(reports ? a.cats : logs.slice(0, 6)).length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/70 text-xs uppercase text-slate-400">
                    <tr>
                      {reports
                        ? <><th className="p-3">Category</th><th className="p-3">Emission</th><th className="p-3">Activities</th><th className="p-3">Share</th></>
                        : <><th className="p-3">Date</th><th className="p-3">Category</th><th className="p-3">Activity Type</th><th className="p-3">Quantity</th><th className="p-3">Factor</th><th className="p-3">Carbon Emission</th></>
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {(reports ? a.cats : logs.slice(0, 6)).map(x => reports
                      ? <tr key={x.key} className="border-t border-slate-800"><td className="p-3">{x.name}</td><td className="p-3">{kg(x.emission)}</td><td className="p-3">{x.activities}</td><td className="p-3">{x.percent.toFixed(1)}%</td></tr>
                      : <tr key={x.activityLogId} className="border-t border-slate-800"><td className="p-3">{x.activityDate}</td><td className="p-3">{x.categoryName}</td><td className="p-3">{x.activityTypeName}</td><td className="p-3">{x.quantity} {x.unit}</td><td className="p-3">{x.emissionFactor}</td><td className="p-3 text-emerald-400">{kg(x.totalEmission)}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : <p className="p-10 text-center text-sm text-slate-400">No activity data available yet.</p>}
          </section>

          {reports && (
            <button onClick={() => {
              const rows = [['Date', 'Category', 'Activity Type', 'Quantity', 'Unit', 'Emission Factor', 'Carbon Emission'],
                ...logs.map(l => [l.activityDate, l.categoryName, l.activityTypeName, l.quantity, l.unit, l.emissionFactor, l.totalEmission])];
              const url = URL.createObjectURL(new Blob([rows.map(r => r.map(v => `"${String(v ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')], { type: 'text/csv' }));
              const e = document.createElement('a'); e.href = url; e.download = 'ecotrack-report.csv'; e.click(); URL.revokeObjectURL(url);
            }} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950">Export CSV Report</button>
          )}
        </>
      )}
    </main>
  );
}

export default function UserDashboard() { return <AnalyticsContent />; }
