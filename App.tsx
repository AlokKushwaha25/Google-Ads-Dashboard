
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { ParsedData, DataRow, ViewType, AnalysisType, ColumnMapping, ColumnRole } from './types';
import DataTable from './components/DataTable';
import UploadIcon from './components/icons/UploadIcon';
import VisualizationSidebar from './components/VisualizationSidebar';
import AnalysisDisplay from './components/CostVsGenderAnalysis';
import SidebarIcon from './components/icons/SidebarIcon';

const initialMapping: ColumnMapping = {
    date: null,
    cost: null,
    revenue: null,
    gender: null,
    device: null,
    age: null,
};

const App: React.FC = () => {
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'analysis'>('table');
  const [activeAnalyses, setActiveAnalyses] = useState<AnalysisType[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>(initialMapping);
  const [mappingHeader, setMappingHeader] = useState<string | null>(null);

  const dataFileInputRef = useRef<HTMLInputElement>(null);

  const autoMapColumns = useCallback((headers: string[]) => {
    const mapping: ColumnMapping = { ...initialMapping };
    const usedHeaders = new Set<string>();

    const findAndMap = (role: ColumnRole, keywords: string[]) => {
      for (const header of headers) {
        if (usedHeaders.has(header)) continue;
        const lowerHeader = header.toLowerCase();
        if (keywords.some(kw => lowerHeader.includes(kw))) {
          mapping[role] = header;
          usedHeaders.add(header);
          return;
        }
      }
    };

    findAndMap('date', ['date', 'day']);
    findAndMap('cost', ['cost', 'spend']);
    findAndMap('revenue', ['revenue']);
    findAndMap('gender', ['gender']);
    findAndMap('device', ['device']);
    findAndMap('age', ['age']);

    setColumnMapping(mapping);
  }, []);

  const handleDataFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setDataFile(file);
        setError(null);
        setParsedData(null);
        setFilteredData([]);
        setStartDate('');
        setEndDate('');
        setViewMode('table');
        setActiveAnalyses([]);
        setIsSidebarOpen(true);
        setColumnMapping(initialMapping);
        setMappingHeader(null);

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const text = e.target?.result as string;
            const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
            if (lines.length < 2) {
              setError('Data file must have a header and at least one data row.');
              return;
            }
            const parseCsvLine = (line: string): string[] => {
                const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g;
                const matches = [];
                let match;
                while ((match = regex.exec(line))) {
                    matches.push(match[1].replace(/"/g, ''));
                }
                return matches;
            };

            const headers = parseCsvLine(lines[0]).map(h => h.trim());
            
            const rows: DataRow[] = lines.slice(1).map(line => {
              const values = parseCsvLine(line);
              return headers.reduce((obj, header, index) => {
                obj[header] = values[index]?.trim() || '';
                return obj;
              }, {} as DataRow);
            });
            setParsedData({ headers, rows });
            autoMapColumns(headers);
          } catch (err) {
            setError('Failed to parse data file. Please ensure it is a valid CSV/TXT file.');
            setParsedData(null);
          }
        };
        reader.onerror = () => {
            setError('Error reading data file.');
        }
        reader.readAsText(file);
    }
  }, [autoMapColumns]);

  useEffect(() => {
    if (!parsedData) {
      setFilteredData([]);
      return;
    }

    if (!startDate && !endDate) {
      setFilteredData(parsedData.rows);
      return;
    }
    
    if (!columnMapping.date) {
        setError('Please map a "Date" column to enable filtering by date.');
        setFilteredData(parsedData.rows);
        return;
    } else {
        setError(null);
    }

    const parseDate = (dateString: string) => {
        if (!dateString) return new Date('invalid');
        if (!/^\d{2}-\d{2}-\d{4}$/.test(dateString)) return new Date(dateString);
        const [day, month, year] = dateString.split('-');
        return new Date(`${year}-${month}-${day}`);
    };

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if(start) start.setUTCHours(0,0,0,0);
    if(end) end.setUTCHours(23,59,59,999);

    const filtered = parsedData.rows.filter(row => {
      const day = parseDate(row[columnMapping.date!]);
      if (isNaN(day.getTime())) return false;
      if (start && day < start) return false;
      if (end && day > end) return false;
      return true;
    });

    setFilteredData(filtered);
  }, [startDate, endDate, parsedData, columnMapping.date]);
  
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = e.target.value;
    const toYYYYMMDD = (d: Date) => d.toISOString().split('T')[0];
    const today = new Date();
    let start = new Date();
    let end = new Date();

    if (!preset) {
        setStartDate('');
        setEndDate('');
        return;
    }

    switch (preset) {
      case 'yesterday':
        start.setDate(today.getDate() - 1);
        end.setDate(today.getDate() - 1);
        break;
      case 'last_week':
        start.setDate(today.getDate() - today.getDay() - 6);
        end.setDate(today.getDate() - today.getDay());
        break;
      case 'last_7_days':
        start.setDate(today.getDate() - 6);
        end = today;
        break;
      case 'last_14_days':
        start.setDate(today.getDate() - 13);
        end = today;
        break;
      case 'last_30_days':
        start.setDate(today.getDate() - 29);
        end = today;
        break;
      case 'last_month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'last_3_months':
        start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        return;
    }
    setStartDate(toYYYYMMDD(start));
    setEndDate(toYYYYMMDD(end));
    e.target.value = '';
  };
  
  const handleMapColumn = (header: string, role: ColumnRole) => {
    setColumnMapping(prev => {
        const newMapping = { ...prev };
        // Clear any other column that has this role
        (Object.keys(newMapping) as ColumnRole[]).forEach(r => {
            if (newMapping[r] === header) newMapping[r] = null;
            if (r === role) newMapping[r] = header;
        });
        return newMapping;
    });
    setMappingHeader(null);
  };
  
  const handleClearColumnMapping = (header: string) => {
    setColumnMapping(prev => {
        const newMapping = { ...prev };
         (Object.keys(newMapping) as ColumnRole[]).forEach(r => {
            if (newMapping[r] === header) newMapping[r] = null;
        });
        return newMapping;
    });
    setMappingHeader(null);
  };
  
  const toggleAnalysis = (analysis: AnalysisType) => {
    setViewMode('analysis');
    setActiveAnalyses(prev => 
      prev.includes(analysis)
        ? prev.filter(a => a !== analysis)
        : [...prev, analysis]
    );
  };

  const showDataTable = () => {
    setViewMode('table');
  };

  const renderMainContent = () => {
    if (!parsedData) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] text-gray-500 border-2 border-dashed rounded-lg bg-gray-800/50 border-gray-700">
                <UploadIcon className="w-16 h-16 mb-4"/>
                <h2 className="text-2xl font-semibold text-gray-400">Upload a Data File</h2>
                <p>Click the "Upload Data" button to get started.</p>
            </div>
        );
    }
    
    if (viewMode === 'table') {
        return <DataTable 
                    data={parsedData} 
                    filteredRows={filteredData} 
                    columnMapping={columnMapping}
                    mappingHeader={mappingHeader}
                    onHeaderClick={setMappingHeader}
                    onMapColumn={handleMapColumn}
                    onClearMapping={handleClearColumnMapping}
                />;
    }

    if (viewMode === 'analysis') {
        if (activeAnalyses.length === 0) {
            return (
                <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg bg-gray-800/50 border-gray-700">
                    <p className="text-gray-500">Select one or more analyses from the sidebar to view charts.</p>
                </div>
            );
        }
        return (
            <div className="space-y-8">
                {activeAnalyses.map(analysisType => {
                    switch (analysisType) {
                        case 'cost_vs_gender':
                            return <AnalysisDisplay key={analysisType} data={filteredData} categoryKey={columnMapping.gender!} valueKey={columnMapping.cost!} title="Cost Distribution by Gender" />;
                        case 'cost_vs_device':
                            return <AnalysisDisplay key={analysisType} data={filteredData} categoryKey={columnMapping.device!} valueKey={columnMapping.cost!} title="Cost Distribution by Device" />;
                        case 'cost_vs_age':
                            return <AnalysisDisplay key={analysisType} data={filteredData} categoryKey={columnMapping.age!} valueKey={columnMapping.cost!} title="Cost Distribution by Age" />;
                        case 'revenue_vs_gender':
                            return <AnalysisDisplay key={analysisType} data={filteredData} categoryKey={columnMapping.gender!} valueKey={columnMapping.revenue!} title="Revenue Distribution by Gender" />;
                        case 'revenue_vs_device':
                            return <AnalysisDisplay key={analysisType} data={filteredData} categoryKey={columnMapping.device!} valueKey={columnMapping.revenue!} title="Revenue Distribution by Device" />;
                        case 'revenue_vs_age':
                            return <AnalysisDisplay key={analysisType} data={filteredData} categoryKey={columnMapping.age!} valueKey={columnMapping.revenue!} title="Revenue Distribution by Age" />;
                        default:
                            return null;
                    }
                })}
            </div>
        );
    }
    
    return <DataTable 
                data={parsedData} 
                filteredRows={filteredData} 
                columnMapping={columnMapping}
                mappingHeader={mappingHeader}
                onHeaderClick={setMappingHeader}
                onMapColumn={handleMapColumn}
                onClearMapping={handleClearColumnMapping}
           />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <header className="text-center p-4 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Data Analyzer
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Upload, map, filter, and analyze your data instantly.
        </p>
      </header>
      
      <nav className="bg-gray-800/50 border-b border-gray-700 p-3 flex flex-wrap items-center justify-center gap-4 text-sm sticky top-0 z-10">
        <input type="file" ref={dataFileInputRef} onChange={handleDataFileChange} accept=".csv,.txt" className="hidden" />
        <button 
          onClick={() => dataFileInputRef.current?.click()}
          className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900"
        >
            <UploadIcon className="mr-2 h-5 w-5"/>
            {dataFile ? 'Upload New Data' : 'Upload Data'}
        </button>
        {dataFile && <span className="text-gray-300 truncate max-w-[150px] md:max-w-xs">{dataFile.name}</span>}

        <div className="h-6 w-px bg-gray-600 hidden md:block"></div>

        <label htmlFor="start-date" className="sr-only">Start Date</label>
        <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} disabled={!parsedData || !columnMapping.date} className="bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-indigo-500 focus:border-indigo-500 p-2 disabled:opacity-50 disabled:cursor-not-allowed"/>
        <span className="text-gray-400">to</span>
        <label htmlFor="end-date" className="sr-only">End Date</label>
        <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} disabled={!parsedData || !columnMapping.date} className="bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-indigo-500 focus:border-indigo-500 p-2 disabled:opacity-50 disabled:cursor-not-allowed"/>
        
        <select onChange={handlePresetChange} disabled={!parsedData || !columnMapping.date} defaultValue="" className="bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-indigo-500 focus:border-indigo-500 p-2 disabled:opacity-50 disabled:cursor-not-allowed appearance-none pr-8">
            <option value="" disabled>Select preset...</option>
            <option value="yesterday">Yesterday</option>
            <option value="last_week">Last Week</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_14_days">Last 14 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_month">Last Month</option>
            <option value="last_3_months">Last 3 Months</option>
        </select>
        
        {parsedData && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900"
            title={isSidebarOpen ? "Hide analysis sidebar" : "Show analysis sidebar"}
            aria-controls="analysis-sidebar"
            aria-expanded={isSidebarOpen}
          >
            <SidebarIcon className="h-5 w-5 mr-2" />
            {isSidebarOpen ? 'Hide Analysis' : 'Show Analysis'}
          </button>
        )}
      </nav>

      <main className="flex-grow p-4 lg:p-6" onClick={(e) => { if (!(e.target as HTMLElement).closest('[data-mapping-popover]')) setMappingHeader(null)}}>
        {error && (
            <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Notice: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            <section className={`${parsedData && isSidebarOpen ? 'lg:col-span-3' : 'lg:col-span-4'} h-[calc(100vh-180px)] min-h-[500px] overflow-y-auto pr-2 transition-all duration-300`}>
                {renderMainContent()}
            </section>
            
            {parsedData && isSidebarOpen && (
                <aside id="analysis-sidebar" className="lg:col-span-1 h-[calc(100vh-180px)] min-h-[500px]">
                    <VisualizationSidebar 
                        columnMapping={columnMapping}
                        viewMode={viewMode}
                        activeAnalyses={activeAnalyses}
                        toggleAnalysis={toggleAnalysis}
                        showDataTable={showDataTable}
                    />
                </aside>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
