import React from 'react';
import type { AnalysisType } from '../types';

interface VisualizationSidebarProps {
  headers: string[];
  viewMode: 'table' | 'analysis';
  activeAnalyses: AnalysisType[];
  toggleAnalysis: (analysis: AnalysisType) => void;
  showDataTable: () => void;
}

const AnalysisButton: React.FC<{
  onClick: () => void;
  label: string;
  isActive: boolean;
  disabled?: boolean;
}> = ({ onClick, label, isActive, disabled = false }) => {
  const baseClasses = "w-full px-4 py-2.5 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors";
  const activeClasses = "bg-indigo-600 text-white";
  const inactiveClasses = "bg-gray-700 hover:bg-gray-600 text-gray-200";
  const disabledClasses = "bg-gray-700/50 text-gray-500 cursor-not-allowed";

  const getClasses = () => {
    if (disabled) return `${baseClasses} ${disabledClasses}`;
    if (isActive) return `${baseClasses} ${activeClasses}`;
    return `${baseClasses} ${inactiveClasses}`;
  }

  return (
    <button onClick={onClick} disabled={disabled} className={getClasses()}>
      {label}
    </button>
  );
};


const VisualizationSidebar: React.FC<VisualizationSidebarProps> = ({ headers, viewMode, activeAnalyses, toggleAnalysis, showDataTable }) => {
  const hasCost = headers.includes('Cost');
  const canAnalyzeGender = hasCost && headers.includes('Gender');
  const canAnalyzeDevice = hasCost && headers.includes('Device');
  const canAnalyzeAge = hasCost && headers.includes('Age');

  const analysisOptions: { view: AnalysisType; label: string; enabled: boolean; }[] = [
    { view: 'cost_vs_gender', label: 'Cost vs Gender', enabled: canAnalyzeGender },
    { view: 'cost_vs_device', label: 'Cost vs Device', enabled: canAnalyzeDevice },
    { view: 'cost_vs_age', label: 'Cost vs Age', enabled: canAnalyzeAge },
  ];

  return (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-2">
        <h2 className="text-xl font-semibold">
          Analysis Options
        </h2>
      </div>
      <div className="space-y-3 flex-grow overflow-y-auto pr-2">
        <AnalysisButton 
            onClick={showDataTable}
            label="Show Data Table"
            isActive={viewMode === 'table'}
        />
        <div className="h-px bg-gray-600"></div>
        {analysisOptions.map(opt => (
            <div key={opt.view}>
                <AnalysisButton
                    onClick={() => toggleAnalysis(opt.view)}
                    label={opt.label}
                    isActive={activeAnalyses.includes(opt.view)}
                    disabled={!opt.enabled}
                />
                {!opt.enabled && (
                    <p className="mt-1 text-xs text-amber-400">
                        Requires '{opt.label.split(' vs ')[1]}' and 'Cost' columns.
                    </p>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default VisualizationSidebar;