// FIX: Replaced incorrect component definition with the correct type definitions for the application.
export type DataRow = Record<string, string>;

export interface ParsedData {
  headers: string[];
  rows: DataRow[];
}

export type ViewType = 'table' | 'analysis';

export type AnalysisType =
  | 'cost_vs_gender'
  | 'cost_vs_device'
  | 'cost_vs_age'
  | 'revenue_vs_gender'
  | 'revenue_vs_device'
  | 'revenue_vs_age'
  | 'cost_revenue_by_day';

export type ColumnRole = 'date' | 'cost' | 'revenue' | 'gender' | 'device' | 'age' | 'day_of_week';

export type ColumnMapping = Record<ColumnRole, string | null>;
