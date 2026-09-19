import React, { useState } from 'react';
import { ShieldAlert, ArrowLeft, BookmarkCheck, Share2, CheckCircle2, AlertTriangle, Info, Copy, Check, FileText } from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import IndicatorCard from '../components/IndicatorCard';

export default function ResultsPage({ analysisData, inputType, inputText, onReset, onSaveReport }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!analysisData) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">No Analysis Results Found</h2>
        <button onClick={onReset} className="px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold">
          Perform Analysis
        </button>
      </div>
    );
  }

  const {
    riskScore = 0,
    riskLevel = "LOW",
    indicators = [],
    explanation = "",
    recommendedActions = [],
    verificationSignals = [],
    aiAnalysisAvailable = false
  } = analysisData;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveReport(analysisData);
    setSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Top Header / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Analyze Another Opportunity</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              saved
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-emerald-400" />
            <span>{saved ? 'Saved to Dashboard' : 'Save Report'}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Report Container */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative">
        
        {/* Report Header Title */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-sky-400">
                RECRUITMENT SAFETY REPORT
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Safety Risk Assessment
            </h1>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-400 block">Input Type: {inputType.toUpperCase()}</span>
            <span className="text-[11px] font-mono text-slate-400 block">Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Score & Primary Assessment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8 items-center">
          
          {/* Gauge Col */}
          <div className="md:col-span-5 flex justify-center">
            <RiskGauge score={riskScore} level={riskLevel} />
          </div>

          {/* Explanation Col */}
          <div className="md:col-span-7 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                <Info className="w-4 h-4 text-sky-400" />
                <span>Executive Summary</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {explanation}
              </p>
            </div>

            {/* AI Analysis Tag */}
            <div className="flex items-center gap-2 text-xs text-slate-400 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800/80 w-fit">
              <span className={`w-2 h-2 rounded-full ${aiAnalysisAvailable ? 'bg-sky-400' : 'bg-amber-400'}`} />
              <span>{aiAnalysisAvailable ? 'AI Enhanced Risk Scanner Active' : 'Local Rule Engine Risk Assessment'}</span>
            </div>
          </div>
        </div>

        {/* Verification Signals (if any) */}
        {verificationSignals && verificationSignals.length > 0 && (
          <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Domain & Verification Signals Detected:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
              {verificationSignals.map((signal, idx) => (
                <li key={idx}>{signal}</li>
              ))}
            </ul>
          </div>
        )}

        {/* DETECTED INDICATORS SECTION */}
        <div className="space-y-4 my-8">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Detected Risk Indicators ({indicators.length})</span>
          </h3>

          {indicators.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No suspicious risk indicators detected in this content. Standard verification is still recommended.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {indicators.map((ind, i) => (
                <IndicatorCard key={i} indicator={ind} />
              ))}
            </div>
          )}
        </div>

        {/* WHY THIS MATTERS SECTION */}
        <div className="glass-card p-6 rounded-2xl space-y-3 my-8 bg-slate-900/60 border border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>WHY THIS MATTERS</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Legitimate employers and reputable companies generally do not require candidates to pay upfront registration fees, security deposits, or transfer money to secure an internship or job placement. Demands for immediate payment or sensitive banking data are major warning signs that should be independently verified before taking any action.
          </p>
        </div>

        {/* WHAT YOU SHOULD DO SECTION */}
        <div className="space-y-4 my-8">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>WHAT YOU SHOULD DO</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendedActions.map((action, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-xs text-slate-200 leading-relaxed">{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400">
            <strong>Safety Disclaimer:</strong> InternGuard provides explainable risk indicators for educational and verification purposes. We recommend verifying all corporate opportunities directly through official company domain websites.
          </p>
        </div>

      </div>
    </div>
  );
}
