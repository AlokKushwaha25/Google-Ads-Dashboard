import React, { useMemo } from 'react';
import type { DataRow } from '../types';
import BarChart from './BarChart';

interface DayOfWeekAnalysisProps {
  data: DataRow[];
  dayKey: string;
  costKey: string;
  revenueKey: string;
}

const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DayOfWeekAnalysis: React.FC<DayOfWeekAnalysisProps> = ({ data, dayKey, costKey, revenueKey }) => {
  const analysis = useMemo(() => {
    const dailyData: Record<string, { cost: number; revenue: number }> = {};
    WEEK_DAYS.forEach(day => {
        dailyData[day] = { cost: 0, revenue: 0 };
    });

    data.forEach(row => {
      const day = row[dayKey];
      if (WEEK_DAYS.includes(day)) {
        const cost = parseFloat(row[costKey]?.replace(',', '.') || '0');
        const revenue = parseFloat(row[revenueKey]?.replace(',', '.') || '0');
        
        if (!isNaN(cost)) dailyData[day].cost += cost;
        if (!isNaN(revenue)) dailyData[day].revenue += revenue;
      }
    });
    
    const tableData = WEEK_DAYS.map(day => ({
        day,
        ...dailyData[day]
    }));

    const chartData = {
      labels: WEEK_DAYS,
      datasets: [
        {
          label: 'Cost',
          data: WEEK_DAYS.map(day => dailyData[day].cost),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'Revenue',
          data: WEEK_DAYS.map(day => dailyData[day].revenue),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };

    return { tableData, chartData };
  }, [data, dayKey, costKey, revenueKey]);
  
  if (!analysis) {
      return (
          <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg bg-gray-800/50 border-gray-700">
            <p className="text-gray-500">No data to display for the weekly analysis.</p>
          </div>
      )
  }

  return (
    <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700 min-h-full">
        <div className="flex flex-col gap-8">
            <div className="relative h-96">
                <BarChart chartData={analysis.chartData} title="Cost & Revenue by Day of the Week" />
            </div>
            <div className="w-full">
                <h3 className="text-lg font-medium mb-2 text-gray-200">Weekly Summary</h3>
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Day of the Week</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-300 uppercase">Total Cost</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-300 uppercase">Total Revenue</th>
                    </tr>
                    </thead>
                    <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                    {analysis.tableData.map(item => (
                        <tr key={item.day}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400">{item.day}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400 text-right">{item.cost.toLocaleString('en-US', { style: 'currency', currency: 'EUR' })}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400 text-right">{item.revenue.toLocaleString('en-US', { style: 'currency', currency: 'EUR' })}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
};

export default DayOfWeekAnalysis;
