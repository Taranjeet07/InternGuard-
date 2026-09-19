import React, { useState } from 'react';
import { MessageSquare, Image, Globe, Upload, Search, Play, ShieldAlert, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { analyzeText, analyzeScreenshot, analyzeUrl } from '../services/api';

export default function AnalyzePage({ onAnalysisComplete, demoPreset, setDemoPreset }) {
  const [activeTab, setActiveTab] = useState('text'); // 'text', 'screenshot', 'url'
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Scanning recruitment indicators...');

  // Form states
  const [textInput, setTextInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [websiteInput, setWebsiteInput] = useState('');

  // Screenshot states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // URL tab states
  const [urlInput, setUrlInput] = useState('');
  const [urlCompanyInput, setUrlCompanyInput] = useState('');

  // Preset scenarios
  const applyPreset = (type) => {
    if (type === 'HIGH') {
      setActiveTab('text');
      setTextInput("Congratulations! You have been selected for our internship. Pay ₹1999 registration fee today to confirm your seat. Limited seats available. Send Aadhaar and bank details immediately.");
      setCompanyInput("Global Tech Solutions");
      setEmailInput("hr@gmail.com");
      setWebsiteInput("http://globaltech-verify.xyz");
    } else if (type === 'MEDIUM') {
      setActiveTab('text');
      setTextInput("You have been shortlisted for our remote internship position. Please complete your profile and submit your documents for background check.");
      setCompanyInput("Apex Softwares");
      setEmailInput("careers@apexsoftwares.com");
      setWebsiteInput("https://apexsoftwares.com");
    } else if (type === 'LOW') {
      setActiveTab('text');
      setTextInput("Thank you for applying for the Software Engineering Internship. Our recruitment team will review your resume. Shortlisted candidates will be contacted through our official company portal.");
      setCompanyInput("Microsoft Corporation");
      setEmailInput("recruiting@microsoft.com");
      setWebsiteInput("https://careers.microsoft.com");
    }
  };

  // Handle Text Submission
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    setIsLoading(true);
    setLoadingStep('Scanning recruitment indicators...');
    setTimeout(() => setLoadingStep('Checking suspicious patterns...'), 600);
    setTimeout(() => setLoadingStep('Generating explainable risk assessment...'), 1200);

    try {
      const result = await analyzeText({
        text: textInput,
        company: companyInput,
        recruiterEmail: emailInput,
        website: websiteInput
      });
      onAnalysisComplete(result, 'text', textInput);
    } catch (err) {
      alert(`Error during analysis: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Screenshot File Select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleScreenshotSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    setLoadingStep('Extracting text via OCR scanner...');
    setTimeout(() => setLoadingStep('Evaluating screenshot risk factors...'), 800);

    try {
      const formData = new FormData();
      formData.append('screenshot', selectedFile);
      const result = await analyzeScreenshot(formData);
      onAnalysisComplete(result, 'screenshot', result.extractedText || "Uploaded screenshot");
    } catch (err) {
      alert(`Screenshot analysis error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle URL Submission
  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsLoading(true);
    setLoadingStep('Verifying URL structure & domain protocols...');

    try {
      const result = await analyzeUrl({
        url: urlInput,
        company: urlCompanyInput
      });
      onAnalysisComplete(result, 'url', urlInput);
    } catch (err) {
      alert(`URL analysis error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Interactive Risk Assessment</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Analyze Internship Opportunity</h1>
        <p className="text-sm text-slate-400 mt-2">
          Paste recruitment messages, upload screenshots, or check URLs for risk indicators.
        </p>
      </div>

      {/* Demo Mode Presets Toolbar */}
      <div className="glass-card p-4 rounded-2xl mb-8 border border-sky-500/20 bg-sky-950/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
            <Play className="w-4 h-4 text-sky-400 fill-sky-400/20" />
            <span>QUICK DEMO PRESETS:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyPreset('HIGH')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>High Risk Demo (86)</span>
            </button>

            <button
              onClick={() => applyPreset('MEDIUM')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Needs Verification (45)</span>
            </button>

            <button
              onClick={() => applyPreset('LOW')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Low Risk Demo (10)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="flex items-center justify-center p-1.5 glass-card rounded-xl mb-6 max-w-md mx-auto">
        {[
          { id: 'text', label: 'Message', icon: MessageSquare },
          { id: 'screenshot', label: 'Screenshot', icon: Image },
          { id: 'url', label: 'URL Check', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-sky-500 text-white shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Analysis Form Container */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl relative">
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#0B0F17]/90 backdrop-blur-md rounded-2xl z-20 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-sky-400 animate-spin" />
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Scanning Recruitment Indicators</h3>
              <p className="text-xs text-sky-400 font-mono animate-pulse">{loadingStep}</p>
            </div>
          </div>
        )}

        {/* TAB 1: TEXT MESSAGE */}
        {activeTab === 'text' && (
          <form onSubmit={handleTextSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Recruitment Message Content <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={6}
                required
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={`Congratulations! You have been selected for our internship.\nPay ₹1999 registration fee to confirm your seat.\nLimited seats available. Send Aadhaar and bank details immediately...`}
                className="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500 font-mono"
              />
            </div>

            {/* Optional Context Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Company Name (Optional)</label>
                <input
                  type="text"
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  placeholder="e.g. Acme Tech"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Recruiter Email (Optional)</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. hr@gmail.com"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Company Website (Optional)</label>
                <input
                  type="text"
                  value={websiteInput}
                  onChange={(e) => setWebsiteInput(e.target.value)}
                  placeholder="e.g. https://acme.com"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-glow-cyan transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Analyze Opportunity</span>
            </button>
          </form>
        )}

        {/* TAB 2: SCREENSHOT */}
        {activeTab === 'screenshot' && (
          <form onSubmit={handleScreenshotSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Upload Message Screenshot (PNG, JPG, WEBP - Max 5MB)
              </label>

              <div className="border-2 border-dashed border-slate-700/80 hover:border-sky-500 rounded-2xl p-8 text-center transition-all bg-slate-900/40 relative">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />

                {previewUrl ? (
                  <div className="space-y-3">
                    <img src={previewUrl} alt="Screenshot Preview" className="max-h-60 mx-auto rounded-xl border border-slate-700 shadow-md" />
                    <p className="text-xs text-slate-400 font-mono">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</p>
                    <span className="text-xs text-sky-400 underline">Click to change image</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 rounded-full bg-sky-500/10 text-sky-400 w-fit mx-auto border border-sky-500/20">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Click to upload or drag & drop</p>
                      <p className="text-xs text-slate-400 mt-1">WhatsApp, Telegram, or Email screenshots accepted</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedFile}
              className={`w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 ${
                selectedFile
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-glow-cyan'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Analyze Screenshot</span>
            </button>
          </form>
        )}

        {/* TAB 3: URL CHECK */}
        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Recruitment Link / Website URL <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="e.g. http://192.168.1.1/verify-seat-update.xyz"
                className="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-sky-500 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Claimed Company Name (Optional)
              </label>
              <input
                type="text"
                value={urlCompanyInput}
                onChange={(e) => setUrlCompanyInput(e.target.value)}
                placeholder="e.g. Microsoft"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-glow-cyan transition-all flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>Check URL Security</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
