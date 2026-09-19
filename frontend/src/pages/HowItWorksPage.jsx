import React from 'react';
import { ShieldCheck, Lock, Search, FileText, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5" />
          <span>Explainable Architecture</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">How InternGuard Works</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Understand the multi-layer risk analysis engine protecting students from recruitment fraud.
        </p>
      </div>

      {/* Architecture Overview */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldCheck className="w-5 h-5 text-sky-400" />
          <span>Multi-Layer Verification Architecture</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase">Layer 1</span>
            <h3 className="text-base font-bold text-white">Rule-Based Risk Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scans recruitment copy for weighted indicators: Upfront Payment Requests (+25), Artificial Urgency (+15), Guaranteed Selection (+10), and Sensitive Info Demands (+20).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Layer 2</span>
            <h3 className="text-base font-bold text-white">Static URL Analyzer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluates structural link hazards including HTTP protocol usage, direct IP address hosts, excessive subdomains, suspicious TLDs, and company-domain mismatches.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase">Layer 3</span>
            <h3 className="text-base font-bold text-white">AI & OCR Scanner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts text from message screenshots using Tesseract OCR and passes content to AI models for contextual scam pattern detection.
            </p>
          </div>
        </div>
      </div>

      {/* Risk Scoring Breakdown */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
        <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">
          Risk Score Calculation (0 – 100)
        </h2>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-400 text-sm block">0 – 25: LOW RISK</span>
              <span className="text-slate-300">Standard recruitment language with low risk indicators.</span>
            </div>
            <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono">SAFE</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="font-bold text-amber-400 text-sm block">26 – 60: NEEDS VERIFICATION</span>
              <span className="text-slate-300">Contains non-standard signals or minor warning indicators requiring confirmation.</span>
            </div>
            <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">VERIFY</span>
          </div>

          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
            <div>
              <span className="font-bold text-rose-400 text-sm block">61 – 100: HIGH RISK</span>
              <span className="text-slate-300">Multiple major risk indicators detected (such as payment requests or OTP demands).</span>
            </div>
            <span className="px-3 py-1 rounded bg-rose-500/20 text-rose-300 font-bold font-mono">HIGH RISK</span>
          </div>
        </div>
      </div>

    </div>
  );
}
