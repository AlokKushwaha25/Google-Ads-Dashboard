
export type DataRow = Record<string, string>;

export interface ParsedData {
  headers: string[];
  rows: DataRow[];
}

export type AnalysisType = 'cost_vs_gender' | 'cost_vs_device' | 'cost_vs_age';

export type ViewType = 'table' | AnalysisType;
