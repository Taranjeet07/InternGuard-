import React, { useState, useEffect } from 'react';
import { FileText, ShieldAlert, AlertTriangle, CheckCircle2, Search, ArrowRight, ExternalLink } from 'lucide-react';
import { getHistory } from '../services/api';

export default function DashboardPage({ onViewAnalysis, setActivePage }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getHistory();
        setHistory(data || []);
      } catch (err) {
        console.error('History load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalCount = history.length;
  const highRiskCount = history.filter(h => h.riskScore >= 61 || h.riskLevel === 'HIGH').length;
  const verificationCount = history.filter(h => (h.riskScore >= 26 && h.riskScore < 61) || h.riskLevel === 'NEEDS_VERIFICATION').length;
  const lowRiskCount = history.filter(h => h.riskScore < 26 || h.riskLevel === 'LOW').length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Analysis Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Review your recent recruitment opportunity safety scans.</p>
        </div>

        <button
          onClick={() => setActivePage('analyze')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-glow-cyan transition-all w-fit"
        >
          <Search className="w-4 h-4" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Scans</span>
          <span className="text-3xl font-extrabold text-white font-mono">{totalCount}</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block mb-1">High Risk</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-3xl font-extrabold text-rose-400 font-mono">{highRiskCount}</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">Needs Verification</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl font-extrabold text-amber-400 font-mono">{verificationCount}</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">Low Risk</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">{lowRiskCount}</span>
        </div>
      </div>

      {/* History Table / Cards */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-400" />
          <span>Recent Analyses</span>
        </h2>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading history records...</div>
        ) : history.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-slate-400 text-sm">No recruitment analyses found in your history yet.</p>
            <button
              onClick={() => setActivePage('analyze')}
              className="px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold text-xs inline-flex items-center gap-1.5"
            >
              <span>Scan your first opportunity</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Company / Opportunity</th>
                  <th className="p-3">Input Type</th>
                  <th className="p-3">Risk Score</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((item, idx) => {
                  let badge = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
                  if (item.riskScore >= 61 || item.riskLevel === 'HIGH') badge = "bg-rose-500/10 text-rose-400 border-rose-500/30";
                  else if (item.riskScore >= 26 || item.riskLevel === 'NEEDS_VERIFICATION') badge = "bg-amber-500/10 text-amber-400 border-amber-500/30";

                  return (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-mono text-slate-400">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Today'}
                      </td>
                      <td className="p-3 font-semibold text-white">
                        {item.company || item.url || (item.inputText ? item.inputText.slice(0, 45) + '...' : 'Recruitment Analysis')}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] uppercase">
                          {item.inputType || 'text'}
                        </span>
                      </td>
                      <td className="p-3 font-bold font-mono text-white">{item.riskScore} / 100</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badge}`}>
                          {item.riskLevel || (item.riskScore >= 61 ? 'HIGH' : item.riskScore >= 26 ? 'NEEDS VERIFICATION' : 'LOW')}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onViewAnalysis(item)}
                          className="text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1"
                        >
                          <span>Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
