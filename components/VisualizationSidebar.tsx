import React from 'react';
import type { AnalysisType, ColumnMapping } from '../types';

interface VisualizationSidebarProps {
  columnMapping: ColumnMapping;
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


const VisualizationSidebar: React.FC<VisualizationSidebarProps> = ({ columnMapping, viewMode, activeAnalyses, toggleAnalysis, showDataTable }) => {
  const canAnalyzeGender = !!(columnMapping.cost && columnMapping.gender);
  const canAnalyzeDevice = !!(columnMapping.cost && columnMapping.device);
  const canAnalyzeAge = !!(columnMapping.cost && columnMapping.age);
  const canAnalyzeRevenueGender = !!(columnMapping.revenue && columnMapping.gender);
  const canAnalyzeRevenueDevice = !!(columnMapping.revenue && columnMapping.device);
  const canAnalyzeRevenueAge = !!(columnMapping.revenue && columnMapping.age);
  const canAnalyzeDayOfWeek = !!(columnMapping.cost && columnMapping.revenue && columnMapping.day_of_week);

  const costAnalysisOptions: { view: AnalysisType; label: string; enabled: boolean; required: string[] }[] = [
    { view: 'cost_vs_gender', label: 'Cost vs Gender', enabled: canAnalyzeGender, required: ['Cost', 'Gender'] },
    { view: 'cost_vs_device', label: 'Cost vs Device', enabled: canAnalyzeDevice, required: ['Cost', 'Device'] },
    { view: 'cost_vs_age', label: 'Cost vs Age', enabled: canAnalyzeAge, required: ['Cost', 'Age'] },
  ];

  const revenueAnalysisOptions: { view: AnalysisType; label: string; enabled: boolean; required: string[] }[] = [
    { view: 'revenue_vs_gender', label: 'Revenue vs Gender', enabled: canAnalyzeRevenueGender, required: ['Revenue', 'Gender'] },
    { view: 'revenue_vs_device', label: 'Revenue vs Device', enabled: canAnalyzeRevenueDevice, required: ['Revenue', 'Device'] },
    { view: 'revenue_vs_age', label: 'Revenue vs Age', enabled: canAnalyzeRevenueAge, required: ['Revenue', 'Age'] },
  ];

  const performanceAnalysisOptions: { view: AnalysisType; label: string; enabled: boolean; required: string[] }[] = [
      { view: 'cost_revenue_by_day', label: 'Cost & Revenue by Day', enabled: canAnalyzeDayOfWeek, required: ['Cost', 'Revenue', 'Day of the Week']}
  ]

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
        
        <div className="h-px bg-gray-600 my-3"></div>
        <h3 className="px-1 text-xs font-bold tracking-wider text-gray-400 uppercase">Performance Analysis</h3>
        {performanceAnalysisOptions.map(opt => (
             <div key={opt.view}>
                <AnalysisButton
                    onClick={() => toggleAnalysis(opt.view)}
                    label={opt.label}
                    isActive={activeAnalyses.includes(opt.view)}
                    disabled={!opt.enabled}
                />
                {!opt.enabled && (
                    <p className="mt-1 text-xs text-amber-400">
                        Requires '{opt.required.join(`', '`)}' columns to be mapped.
                    </p>
                )}
            </div>
        ))}

        <div className="h-px bg-gray-600 my-3"></div>
        <h3 className="px-1 text-xs font-bold tracking-wider text-gray-400 uppercase">Cost Analysis</h3>
        {costAnalysisOptions.map(opt => (
            <div key={opt.view}>
                <AnalysisButton
                    onClick={() => toggleAnalysis(opt.view)}
                    label={opt.label}
                    isActive={activeAnalyses.includes(opt.view)}
                    disabled={!opt.enabled}
                />
                {!opt.enabled && (
                    <p className="mt-1 text-xs text-amber-400">
                        Requires '{opt.required.join(`' & '`)}' columns to be mapped.
                    </p>
                )}
            </div>
        ))}

        <div className="h-px bg-gray-600 my-3"></div>
        <h3 className="px-1 text-xs font-bold tracking-wider text-gray-400 uppercase">Revenue Analysis</h3>
        {revenueAnalysisOptions.map(opt => (
            <div key={opt.view}>
                <AnalysisButton
                    onClick={() => toggleAnalysis(opt.view)}
                    label={opt.label}
                    isActive={activeAnalyses.includes(opt.view)}
                    disabled={!opt.enabled}
                />
                {!opt.enabled && (
                    <p className="mt-1 text-xs text-amber-400">
                        Requires '{opt.required.join(`' & '`)}' columns to be mapped.
                    </p>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default VisualizationSidebar;
