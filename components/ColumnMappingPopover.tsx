
import React from 'react';
import type { ColumnMapping, ColumnRole } from '../types';

interface ColumnMappingPopoverProps {
  header: string;
  columnMapping: ColumnMapping;
  onMapColumn: (header: string, role: ColumnRole) => void;
  onClearMapping: (header: string) => void;
  onClose: () => void;
}

const ROLES_TO_MAP: { role: ColumnRole; label: string }[] = [
    { role: 'date', label: 'Date' },
    { role: 'cost', label: 'Cost' },
    { role: 'revenue', label: 'Revenue' },
    { role: 'gender', label: 'Gender' },
    { role: 'device', label: 'Device' },
    { role: 'age', label: 'Age' },
];

const ColumnMappingPopover: React.FC<ColumnMappingPopoverProps> = ({ header, columnMapping, onMapColumn, onClearMapping, onClose }) => {
    const headerRole = (Object.keys(columnMapping) as ColumnRole[]).find(r => columnMapping[r] === header);
    
    return (
        <div 
            className="absolute top-full mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-20 p-2 text-sm text-white"
            onClick={(e) => e.stopPropagation()}
            data-mapping-popover
        >
            <div className="font-bold border-b border-gray-700 pb-2 mb-2 px-2">Map "{header}"</div>
            <ul className="space-y-1">
                {ROLES_TO_MAP.map(({role, label}) => (
                    <li key={role}>
                        <button
                            onClick={() => onMapColumn(header, role)}
                            className={`w-full text-left px-2 py-1.5 rounded-md flex justify-between items-center transition-colors ${
                                headerRole === role 
                                ? 'bg-indigo-600 font-semibold' 
                                : 'hover:bg-gray-700'
                            }`}
                        >
                            <span>Map to <span className="font-semibold">{label}</span></span>
                            {columnMapping[role] && columnMapping[role] !== header && (
                                <span className="text-xs text-gray-400 bg-gray-700 px-1.5 rounded">{columnMapping[role]}</span>
                            )}
                        </button>
                    </li>
                ))}
            </ul>
            {headerRole && (
                 <>
                    <div className="h-px bg-gray-700 my-2"></div>
                    <button
                        onClick={() => onClearMapping(header)}
                        className="w-full text-left px-2 py-1.5 rounded-md hover:bg-red-900/50 text-red-300"
                    >
                        Unmap this column
                    </button>
                 </>
            )}
        </div>
    )
}

export default ColumnMappingPopover;
