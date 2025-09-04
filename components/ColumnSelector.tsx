
import React from 'react';

interface ColumnSelectorProps {
  headers: string[];
  onLabelChange: (value: string) => void;
  onValueChange: (value: string) => void;
  selectedLabel: string | null;
  selectedValue: string | null;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ headers, onLabelChange, onValueChange, selectedLabel, selectedValue }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="label-column" className="block text-sm font-medium text-gray-300 mb-1">
          Category / Label Column
        </label>
        <select
          id="label-column"
          name="label-column"
          className="block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-white"
          onChange={(e) => onLabelChange(e.target.value)}
          value={selectedLabel || ''}
        >
          <option value="" disabled>Select a column</option>
          {headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="value-column" className="block text-sm font-medium text-gray-300 mb-1">
          Value / Data Column
        </label>
        <select
          id="value-column"
          name="value-column"
          className="block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-white"
          onChange={(e) => onValueChange(e.target.value)}
          value={selectedValue || ''}
        >
          <option value="" disabled>Select a column</option>
          {headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ColumnSelector;
