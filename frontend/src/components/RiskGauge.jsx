import React from 'react';

export default function RiskGauge({ score = 0, level = "LOW" }) {
  const clampedScore = Math.min(Math.max(score, 0), 100);
  
  // Calculate stroke dashoffset for circular gauge (radius 54)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let colorClass = "text-emerald-500";
  let strokeColor = "#10B981";
  let bgGlow = "shadow-glow-green";
  let badgeBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  let levelText = "LOW RISK";

  if (clampedScore >= 61 || level === 'HIGH') {
    colorClass = "text-rose-500";
    strokeColor = "#EF4444";
    bgGlow = "shadow-glow-red";
    badgeBg = "bg-rose-500/10 text-rose-400 border-rose-500/30";
    levelText = "POTENTIALLY HIGH RISK";
  } else if (clampedScore >= 26 || level === 'NEEDS_VERIFICATION') {
    colorClass = "text-amber-500";
    strokeColor = "#F59E0B";
    bgGlow = "shadow-glow-amber";
    badgeBg = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    levelText = "NEEDS VERIFICATION";
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card rounded-2xl relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div 
        className={`absolute -inset-10 opacity-20 blur-3xl rounded-full transition-all duration-700 pointer-events-none ${
          clampedScore >= 61 ? 'bg-rose-500' : clampedScore >= 26 ? 'bg-amber-500' : 'bg-emerald-500'
        }`}
      />

      <div className="relative w-40 h-40 flex items-center justify-center mb-4">
        {/* SVG Circle Gauge */}
        <svg className="w-full h-full transform -rotate-90">
          {/* Track Circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Indicator Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
            {clampedScore}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>

      {/* Risk Badge */}
      <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeBg} ${bgGlow} transition-all`}>
        {levelText}
      </div>
    </div>
  );
}
