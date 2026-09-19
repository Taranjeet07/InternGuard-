import React from 'react';
import { ShieldCheck, Search, AlertCircle, FileSearch, ArrowRight, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';
import RiskGauge from '../components/RiskGauge';

export default function LandingPage({ setActivePage, loadDemoScenario }) {
  return (
    <div className="space-y-24 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>AI Recruitment Protection Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              INTERNGUARD <br />
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Verify Before You Trust.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              AI-powered recruitment safety that helps students identify suspicious internship and job opportunities before they pay money, click dangerous links, or share sensitive information.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setActivePage('analyze')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5" />
                <span>Analyze Opportunity</span>
              </button>

              <button
                onClick={() => {
                  loadDemoScenario('HIGH');
                  setActivePage('analyze');
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 glass-card glass-card-hover border border-slate-700/80 hover:text-white transition-all"
              >
                <span>View Demo</span>
                <ArrowRight className="w-4 h-4 text-sky-400" />
              </button>
            </div>

            {/* Quick stats trust badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg">
              <div>
                <span className="block text-xl font-bold text-white font-mono">100%</span>
                <span className="text-xs text-slate-400">Explainable Analysis</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-sky-400 font-mono">Zero</span>
                <span className="text-xs text-slate-400">False Accusation Guarantee</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-emerald-400 font-mono">Instant</span>
                <span className="text-xs text-slate-400">Risk Assessment</span>
              </div>
            </div>

          </div>

          {/* Right Visual Dashboard Mockup Card */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative">
              
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Live Risk Scanner</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Report #IG-8942</span>
              </div>

              {/* Score Gauge */}
              <div className="flex justify-center mb-6">
                <RiskGauge score={86} level="HIGH" />
              </div>

              {/* Mini Indicators Preview */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-rose-400 font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Upfront Payment Request</span>
                  </div>
                  <span className="font-mono text-rose-400 font-bold">+25 pts</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-rose-400 font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Suspicious URL Domain (.xyz)</span>
                  </div>
                  <span className="font-mono text-rose-400 font-bold">+20 pts</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Artificial Urgency ("Today Only")</span>
                  </div>
                  <span className="font-mono text-amber-400 font-bold">+15 pts</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Why InternGuard Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Why InternGuard?</h2>
          <p className="text-slate-400 text-sm mt-2">
            Built specifically to protect students from predatory registration fees, fake offers, and data harvesting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            {
              title: "Detect Patterns",
              desc: "Identifies payment requests, pressure tactics, and non-standard recruitment channels.",
              icon: FileSearch,
              color: "text-sky-400"
            },
            {
              title: "Analyze Screenshots",
              desc: "Extract text directly from WhatsApp/Telegram message screenshots using OCR.",
              icon: Search,
              color: "text-blue-400"
            },
            {
              title: "Check URLs",
              desc: "Evaluates domain mismatches, insecure HTTP protocols, and free subdomain hosting.",
              icon: Lock,
              color: "text-cyan-400"
            },
            {
              title: "Explainable Risk",
              desc: "Clear point-by-point evidence breaks down exactly why an opportunity is flagged.",
              icon: ShieldCheck,
              color: "text-emerald-400"
            },
            {
              title: "Safer Decisions",
              desc: "Provides actionable step-by-step guidance on how to verify legitimate employers.",
              icon: CheckCircle2,
              color: "text-purple-400"
            }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl glass-card-hover flex flex-col justify-between">
                <div>
                  <div className={`p-3 rounded-xl bg-slate-900/80 w-fit mb-4 ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Simple How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">How It Works</h2>
          <p className="text-slate-400 text-sm mt-2">Simple 4-step recruitment verification pipeline.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Submit", desc: "Paste message text, upload screenshot, or input recruitment URL." },
            { step: "2", title: "Analyze", desc: "Our rule engine & AI scan for risk indicators and domain signals." },
            { step: "3", title: "Understand", desc: "Review the explainable risk score (0-100) and detected evidence." },
            { step: "4", title: "Verify", desc: "Follow recommended actions to safely verify official company details." }
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl relative overflow-hidden">
              <div className="text-4xl font-extrabold text-slate-800 font-mono mb-3">0{item.step}</div>
              <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
