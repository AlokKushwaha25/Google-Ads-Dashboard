import React, { useEffect, useRef } from 'react';

// This tells TypeScript that a 'Chart' constructor is available on the global scope,
// which is true because we loaded it via a <script> tag in index.html.
declare const Chart: any;

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
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null); // Use 'any' for Chart.js instance to avoid type conflicts

  useEffect(() => {
    if (chartRef.current) {
      // Destroy any existing chart instance before creating a new one
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: 'pie',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
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
                  weight: 'bold',
              }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
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
        },
      });
    }

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, title]); // Re-run effect if chartData or title changes

  return <canvas ref={chartRef} />;
};

export default PieChart;