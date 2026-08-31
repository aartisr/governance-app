import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScoreOverview } from './components/ScoreOverview';
import { DimensionDeepDive } from './components/DimensionDeepDive';
import { InteractiveParetoSimulator } from './components/InteractiveParetoSimulator';
import { ComplianceMatrix } from './components/ComplianceMatrix';
import { CustomWeightCalculator } from './components/CustomWeightCalculator';
import { ReportExportModal } from './components/ReportExportModal';
import { NistSafetyCardModal } from './components/NistSafetyCardModal';
import { EVALUATION_DIMENSIONS } from './data/evaluationData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedDimensionId, setSelectedDimensionId] = useState<string>('math-pareto');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isNistModalOpen, setIsNistModalOpen] = useState<boolean>(false);

  // Initial weights map (sum to 100%)
  const initialWeights: Record<string, number> = {};
  EVALUATION_DIMENSIONS.forEach(d => {
    initialWeights[d.id] = d.weight * 100;
  });

  const [weights, setWeights] = useState<Record<string, number>>(initialWeights);

  // Recalculate weighted score dynamically
  const totalWeightSum = (Object.values(weights) as number[]).reduce((a: number, b: number) => a + b, 0);
  const calculatedScore = EVALUATION_DIMENSIONS.reduce((acc: number, dim) => {
    const currentW = weights[dim.id] || (dim.weight * 100);
    return acc + (dim.score * (currentW / (totalWeightSum || 100)));
  }, 0);

  const handleWeightChange = (id: string, newWeight: number) => {
    setWeights(prev => ({
      ...prev,
      [id]: newWeight,
    }));
  };

  const handleResetWeights = () => {
    setWeights(initialWeights);
  };

  const handleSelectDimensionFromOverview = (id: string) => {
    setSelectedDimensionId(id);
    setActiveTab('deepdive');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenNistCard={() => setIsNistModalOpen(true)}
        calculatedScore={calculatedScore}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'overview' && (
          <ScoreOverview
            dimensions={EVALUATION_DIMENSIONS}
            calculatedScore={calculatedScore}
            onSelectDimension={handleSelectDimensionFromOverview}
          />
        )}

        {activeTab === 'deepdive' && (
          <DimensionDeepDive
            dimensions={EVALUATION_DIMENSIONS}
            selectedDimensionId={selectedDimensionId}
            onSelectDimension={setSelectedDimensionId}
          />
        )}

        {activeTab === 'simulator' && (
          <InteractiveParetoSimulator />
        )}

        {activeTab === 'compliance' && (
          <ComplianceMatrix />
        )}

        {activeTab === 'calculator' && (
          <CustomWeightCalculator
            dimensions={EVALUATION_DIMENSIONS}
            weights={weights}
            onWeightChange={handleWeightChange}
            onResetWeights={handleResetWeights}
            calculatedScore={calculatedScore}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-200">Civic Accord Audit Benchmark</span>
            <span>•</span>
            <span className="font-mono text-indigo-400">governanceapp.ai-aarti.com</span>
          </div>
          <div className="text-slate-500">
            Independent AI Governance Assessment Framework & Audit Benchmark • 10/10 Gold Standard
          </div>
        </div>
      </footer>

      {/* Report Export Modal */}
      <ReportExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        dimensions={EVALUATION_DIMENSIONS}
        calculatedScore={calculatedScore}
      />

      {/* NIST System Safety Card Modal */}
      <NistSafetyCardModal
        isOpen={isNistModalOpen}
        onClose={() => setIsNistModalOpen(false)}
      />
    </div>
  );
}
