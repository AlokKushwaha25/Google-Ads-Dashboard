import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface PieChartProps {
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
  title: string;
}

const PieChart: React.FC<PieChartProps> = ({ chartData, title }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#d1d5db', // text-gray-300
          font: {
              size: 12,
          }
        }
      },
      title: {
        display: true,
        text: title,
        color: '#f9fafb', // text-gray-50
        font: {
            size: 16,
            weight: 'bold' as const,
        }
      },
      tooltip: {
          callbacks: {
              label: function(context: any) {
                  let label = context.label || '';
                  if (label) {
                      label += ': ';
                  }
                  if (context.parsed !== null) {
                      label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(context.parsed);
                  }
                  return label;
              }
          }
      }
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;