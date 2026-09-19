import React from 'react';
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-[#080B12] border-t border-slate-800/80 text-slate-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-6 h-6 text-sky-400" />
              <span className="text-lg font-bold text-white tracking-tight">InternGuard</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm mb-4">
              AI-powered recruitment safety platform protecting students and early career job seekers from fraudulent internship offers, registration fee scams, and phishing attempts.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-sky-400/90 bg-sky-950/40 px-3 py-1.5 rounded-md border border-sky-500/20">
              <Lock className="w-3.5 h-3.5" />
              <span>Verify Before You Trust • Hackathon 2026 Edition</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setActivePage('analyze')} className="hover:text-sky-400 transition-colors">Text & Screenshot Scanner</button></li>
              <li><button onClick={() => setActivePage('analyze')} className="hover:text-sky-400 transition-colors">URL Risk Checker</button></li>
              <li><button onClick={() => setActivePage('dashboard')} className="hover:text-sky-400 transition-colors">Analysis History</button></li>
              <li><button onClick={() => setActivePage('community')} className="hover:text-sky-400 transition-colors">Community Warnings</button></li>
            </ul>
          </div>

          {/* Guidelines */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Safety & Standards</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setActivePage('how-it-works')} className="hover:text-sky-400 transition-colors">Risk Scoring Engine</button></li>
              <li><button onClick={() => setActivePage('how-it-works')} className="hover:text-sky-400 transition-colors">Student Protection Guide</button></li>
              <li><span className="text-slate-500 cursor-not-allowed">Privacy & Terms</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 InternGuard. Developed for Hackathon Safety Track.</p>
          <p className="text-slate-400">Important: InternGuard provides explainable risk indicators for informational purposes. Always verify through official channels.</p>
        </div>
      </div>
    </footer>
  );
}
