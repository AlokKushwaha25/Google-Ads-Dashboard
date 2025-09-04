
import React from 'react';
import type { DataRow, ColumnMapping, ColumnRole } from '../types';
import ColumnMappingPopover from './ColumnMappingPopover';
import TagIcon from './icons/TagIcon';

interface DataTableProps {
  data: { headers: string[]; rows: DataRow[] } | null;
  filteredRows: DataRow[];
  columnMapping: ColumnMapping;
  mappingHeader: string | null;
  onHeaderClick: (header: string) => void;
  onMapColumn: (header: string, role: ColumnRole) => void;
  onClearMapping: (header: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, filteredRows, columnMapping, mappingHeader, onHeaderClick, onMapColumn, onClearMapping }) => {
  if (!data || data.headers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg bg-gray-800/50 border-gray-700">
        <p className="text-gray-500">Upload a data file to see a preview</p>
      </div>
    );
  }

  const { headers } = data;
  const headerToRoleMap = Object.entries(columnMapping).reduce((acc, [role, header]) => {
      if(header) acc[header] = role;
      return acc;
  }, {} as Record<string, string>);

  return (
    <div className="h-full overflow-auto bg-gray-800/50 rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800 sticky top-0 z-10">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider relative group"
              >
                <div 
                    className="flex items-center gap-2 cursor-pointer" 
                    onClick={(e) => { e.stopPropagation(); onHeaderClick(mappingHeader === header ? null : header)}}
                >
                    <span>{header}</span>
                    {headerToRoleMap[header] && (
                        <span className="flex items-center gap-1 bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-full text-xs font-bold">
                            <TagIcon className="h-3 w-3" />
                            {headerToRoleMap[header].toUpperCase()}
                        </span>
                    )}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 text-xs">(map column)</span>
                </div>

                {mappingHeader === header && (
                    <ColumnMappingPopover 
                        header={header}
                        columnMapping={columnMapping}
                        onMapColumn={onMapColumn}
                        onClearMapping={onClearMapping}
                        onClose={() => onHeaderClick(null)}
                    />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {filteredRows.length > 0 ? (
            filteredRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-700/50">
                {headers.map((header) => (
                  <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center py-10 text-gray-500">
                No data matches the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
