import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import AnalyzePage from './pages/AnalyzePage';
import ResultsPage from './pages/ResultsPage';
import DashboardPage from './pages/DashboardPage';
import CommunityReportsPage from './pages/CommunityReportsPage';
import HowItWorksPage from './pages/HowItWorksPage';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home', 'analyze', 'results', 'dashboard', 'community', 'how-it-works'
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentInputType, setCurrentInputType] = useState('text');
  const [currentInputText, setCurrentInputText] = useState('');
  const [demoPreset, setDemoPreset] = useState(null);

  // Handle analysis completion
  const handleAnalysisComplete = (data, inputType = 'text', textContent = '') => {
    setAnalysisResult(data);
    setCurrentInputType(inputType);
    setCurrentInputText(textContent);
    setActivePage('results');
  };

  // Handle resetting to analyze page
  const handleReset = () => {
    setAnalysisResult(null);
    setActivePage('analyze');
  };

  // Handle saving report to local history
  const handleSaveReport = (data) => {
    const existing = JSON.parse(localStorage.getItem('internguard_history') || '[]');
    const newItem = {
      _id: 'local_' + Date.now(),
      inputType: currentInputType,
      inputText: currentInputText,
      riskScore: data.riskScore,
      riskLevel: data.riskLevel,
      indicators: data.indicators,
      explanation: data.explanation,
      createdAt: new Date().toISOString()
    };
    existing.unshift(newItem);
    localStorage.setItem('internguard_history', JSON.stringify(existing));
  };

  // Handle viewing specific history item
  const handleViewHistoryItem = (item) => {
    setAnalysisResult(item);
    setCurrentInputType(item.inputType || 'text');
    setCurrentInputText(item.inputText || '');
    setActivePage('results');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0B0F17] text-slate-100 font-sans">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-grow">
        {activePage === 'home' && (
          <LandingPage
            setActivePage={setActivePage}
            loadDemoScenario={(type) => {
              setDemoPreset(type);
            }}
          />
        )}

        {activePage === 'analyze' && (
          <AnalyzePage
            onAnalysisComplete={handleAnalysisComplete}
            demoPreset={demoPreset}
            setDemoPreset={setDemoPreset}
          />
        )}

        {activePage === 'results' && (
          <ResultsPage
            analysisData={analysisResult}
            inputType={currentInputType}
            inputText={currentInputText}
            onReset={handleReset}
            onSaveReport={handleSaveReport}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            onViewAnalysis={handleViewHistoryItem}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'community' && (
          <CommunityReportsPage />
        )}

        {activePage === 'how-it-works' && (
          <HowItWorksPage />
        )}
      </main>

      <Footer setActivePage={setActivePage} />
    </div>
  );
}
