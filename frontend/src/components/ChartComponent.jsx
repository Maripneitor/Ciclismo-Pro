// components/ChartComponent.jsx
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Registrar componentes de Chart.js una sola vez
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export const DoughnutChart = ({ data, options }) => {
  return <Doughnut data={data} options={options} />;
};

export const BarChart = ({ data, options }) => {
  return <Bar data={data} options={options} />;
};