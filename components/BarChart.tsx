import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ chartData, title }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#d1d5db', // text-gray-300
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: title,
        color: '#f9fafb', // text-gray-50
        font: { size: 16, weight: 'bold' as const }
      },
      tooltip: {
          callbacks: {
              label: function(context: any) {
                  let label = context.dataset.label || '';
                  if (label) {
                      label += ': ';
                  }
                  if (context.parsed.y !== null) {
                      label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                  }
                  return label;
              }
          }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#d1d5db'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#d1d5db'
        }
      }
    }
  };

  return <Bar options={options} data={chartData} />;
};

export default BarChart;
