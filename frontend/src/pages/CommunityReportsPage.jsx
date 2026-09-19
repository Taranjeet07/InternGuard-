import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, Search, Plus, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { submitReport, getCompanyReports } from '../services/api';

const DEFAULT_SAMPLE_REPORTS = [
  {
    _id: 'demo_1',
    company: 'TechInfra Global',
    recruiter: 'Rahul Sharma',
    url: 'http://techinfra-verify.xyz',
    reason: 'Asked for ₹1999 registration fee immediately after sending unofficial WhatsApp offer letter.',
    evidence: 'Demanded payment via UPI before releasing offer letter.',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'demo_2',
    company: 'Digital Solutions Ltd',
    recruiter: 'Priya Verma',
    url: 'http://digital-careers.rf.gd',
    reason: 'Promised ₹60,000 monthly stipend for typing job without any interview.',
    evidence: 'Requested bank account details and Aadhaar card scan on Telegram.',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export default function CommunityReportsPage() {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form states
  const [company, setCompany] = useState('');
  const [recruiter, setRecruiter] = useState('');
  const [url, setUrl] = useState('');
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState('');

  useEffect(() => {
    async function fetchReports() {
      if (searchQuery.trim()) {
        const res = await getCompanyReports(searchQuery);
        setReports(res.reports || []);
      } else {
        const saved = JSON.parse(localStorage.getItem('internguard_reports') || '[]');
        setReports(saved.length > 0 ? saved : DEFAULT_SAMPLE_REPORTS);
      }
    }
    fetchReports();
  }, [searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company.trim() || !reason.trim()) return;

    try {
      const created = await submitReport({ company, recruiter, url, reason, evidence });
      setReports(prev => [created, ...prev]);
      setShowModal(false);
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 3000);

      // Reset form
      setCompany('');
      setRecruiter('');
      setUrl('');
      setReason('');
      setEvidence('');
    } catch (err) {
      alert(`Submission error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Community Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Community Scam Reports</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse and file warnings submitted by students about suspicious recruiters and fraudulent job postings.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-glow-amber transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Community Report</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {formSubmitted && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Your community report has been submitted successfully. Thank you for protecting students!</span>
        </div>
      )}

      {/* Search Filter */}
      <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by company name..."
          className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500"
        />
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-400 text-sm">
            No community reports found for "{searchQuery}".
          </div>
        ) : (
          reports.map((rep, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl space-y-3 border-l-4 border-l-amber-500">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">{rep.company}</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Recruiter: {rep.recruiter || 'Unspecified'} {rep.url && `• Link: ${rep.url}`}
                  </p>
                </div>

                <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Reported by User</span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
                <span className="font-semibold text-amber-400">Report Reason: </span>
                {rep.reason}
              </div>

              {rep.evidence && (
                <p className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Evidence: </span>{rep.evidence}
                </p>
              )}

              <div className="text-[10px] text-slate-500 font-mono pt-1">
                Filed on: {rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : 'Recently'}
              </div>
            </div>
          ))
        )}
      </div>

      {/* SUBMIT REPORT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#0B0F17]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-700 shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Submit Community Warning</span>
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Fake Corp"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Recruiter Name / Handle (Optional)</label>
                <input
                  type="text"
                  value={recruiter}
                  onChange={(e) => setRecruiter(e.target.value)}
                  placeholder="e.g. John Doe / HR Team"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Recruitment Link / Website URL (Optional)</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g. http://acme-scam.xyz"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason for Report *</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Asked for registration fee of ₹1500 before sending offer letter."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Evidence / Message Details (Optional)</label>
                <textarea
                  rows={2}
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="e.g. WhatsApp chat details or UPI payment demand."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold bg-amber-500 hover:bg-amber-400 shadow-glow-amber"
                >
                  Submit Report
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
