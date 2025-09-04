import React, { useMemo } from 'react';
import type { DataRow } from '../types';
import PieChart from './PieChart';

interface AnalysisDisplayProps {
  data: DataRow[];
  categoryKey: string;
  valueKey: string;
  title: string;
}

const CostVsGenderAnalysis: React.FC<AnalysisDisplayProps> = ({ data, categoryKey, valueKey, title }) => {
  const analysis = useMemo(() => {
    const categoryValue: Record<string, number> = {};
    let totalValue = 0;

    data.forEach(row => {
      const category = row[categoryKey] || 'Unknown';
      const valueStr = row[valueKey]?.replace(',', '.') || '0';
      const value = parseFloat(valueStr);

      if (!isNaN(value)) {
        categoryValue[category] = (categoryValue[category] || 0) + value;
        totalValue += value;
      }
    });
    
    if (totalValue === 0) return { tableData: [], chartData: null, totalValue: 0 };

    const labels = Object.keys(categoryValue);
    const values = Object.values(categoryValue);
    
    const tableData = labels.map(label => ({
      category: label,
      value: categoryValue[label],
      percentage: (categoryValue[label] / totalValue) * 100,
    })).sort((a, b) => b.value - a.value);

    const chartData = {
      labels,
      datasets: [
        {
          label: valueKey,
          data: values,
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)',
            'rgba(83, 102, 255, 0.8)',
          ],
          borderColor: [
            '#1f2937', // bg-gray-800
          ],
          borderWidth: 2,
        },
      ],
    };

    return { tableData, chartData, totalValue };
  }, [data, categoryKey, valueKey]);
  
  if (!analysis || !analysis.chartData) {
      return (
          <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg bg-gray-800/50 border-gray-700">
            <p className="text-gray-500">No data to display for the current selection.</p>
          </div>
      )
  }

  return (
    <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700 min-h-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 relative h-80 sm:h-96">
                <PieChart chartData={analysis.chartData} title={title} />
            </div>
            <div className="lg:col-span-2 w-full">
                <h3 className="text-lg font-medium mb-2 text-gray-200">Summary</h3>
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">{categoryKey}</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-300 uppercase">{valueKey}</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-300 uppercase">% of Total</th>
                    </tr>
                    </thead>
                    <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                    {analysis.tableData.map(item => (
                        <tr key={item.category}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400">{item.category}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400 text-right">{item.value.toLocaleString('en-US', { style: 'currency', currency: 'EUR' })}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400 text-right">{item.percentage.toFixed(2)}%</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot className="bg-gray-900">
                        <tr>
                        <td className="px-4 py-2 text-left text-sm font-bold text-gray-200">Total</td>
                        <td className="px-4 py-2 text-right text-sm font-bold text-gray-200">{analysis.totalValue.toLocaleString('en-US', { style: 'currency', currency: 'EUR' })}</td>
                        <td className="px-4 py-2 text-right text-sm font-bold text-gray-200">100.00%</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
  )
};

export default CostVsGenderAnalysis;