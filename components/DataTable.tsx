
import React from 'react';
import type { ParsedData, DataRow } from '../types';

interface DataTableProps {
  data: { headers: string[]; rows: DataRow[] } | null;
  filteredRows: DataRow[];
}

const DataTable: React.FC<DataTableProps> = ({ data, filteredRows }) => {
  if (!data || data.headers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg bg-gray-800/50 border-gray-700">
        <p className="text-gray-500">Upload a data file to see a preview</p>
      </div>
    );
  }

  const { headers } = data;

  return (
    <div className="h-full overflow-auto bg-gray-800/50 rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800 sticky top-0">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                {header}
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
