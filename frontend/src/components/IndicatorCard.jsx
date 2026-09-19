import React from 'react';
import { AlertTriangle, ShieldAlert, DollarSign, Clock, Lock, Award, FileQuestion } from 'lucide-react';

export default function IndicatorCard({ indicator }) {
  const { type, severity, points, evidence } = indicator;

  let severityBadge = "bg-amber-500/10 text-amber-400 border-amber-500/30";
  let iconColor = "text-amber-400";
  let dotColor = "bg-amber-500";
  let borderLeft = "border-l-4 border-l-amber-500";
  let Icon = AlertTriangle;

  if (severity === 'HIGH' || points >= 20) {
    severityBadge = "bg-rose-500/10 text-rose-400 border-rose-500/30";
    iconColor = "text-rose-400";
    dotColor = "bg-rose-500";
    borderLeft = "border-l-4 border-l-rose-500";
    Icon = ShieldAlert;
  } else if (severity === 'LOW') {
    severityBadge = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    iconColor = "text-emerald-400";
    dotColor = "bg-emerald-500";
    borderLeft = "border-l-4 border-l-emerald-500";
  }

  // Choose icon based on type keyword
  const typeLower = (type || '').toLowerCase();
  if (typeLower.includes('payment') || typeLower.includes('fee')) Icon = DollarSign;
  else if (typeLower.includes('urgency') || typeLower.includes('pressure')) Icon = Clock;
  else if (typeLower.includes('sensitive') || typeLower.includes('otp')) Icon = Lock;
  else if (typeLower.includes('guaranteed') || typeLower.includes('selection')) Icon = Award;

  return (
    <div className={`glass-card p-4 rounded-xl ${borderLeft} flex flex-col justify-between gap-2 shadow-sm transition-all hover:bg-slate-800/40`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg bg-slate-800/80 ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 leading-snug">{type}</h4>
            <span className="text-[11px] font-medium text-slate-400">Detected Indicator</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {points > 0 && (
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-400 border border-slate-700">
              +{points} pts
            </span>
          )}
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${severityBadge}`}>
            {severity}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed pl-1 pt-1 bg-slate-900/30 p-2.5 rounded-lg border border-slate-800/60 mt-1">
        <span className="font-semibold text-slate-400">Evidence: </span>
        {evidence}
      </p>
    </div>
  );
}
