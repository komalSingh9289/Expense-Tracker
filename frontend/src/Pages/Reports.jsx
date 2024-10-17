import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import getTransactions from "../api/getTransactions";
import { getCategories } from "../api/getCategories";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions();
        setTransactions(res);
        console.log("Fetched Transactions: ", res);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Function to calculate expenses by title
  const calculateExpensesByTitle = () => {
    const titleData = {};
    transactions.forEach(transaction => {
      if (transaction.sourceType === "Expense") {
        const title = transaction.title; // Use title to categorize
        if (!titleData[title]) {
          titleData[title] = 0;
        }
        titleData[title] += transaction.amount; // Assuming you have amount field
      }
    });
    return titleData;
  };

  // Function to prepare data for the Bar chart
  const prepareBarChartData = () => {
    const titleData = calculateExpensesByTitle();
    const labels = Object.keys(titleData);
    const data = Object.values(titleData);
    
    return {
      labels,
      datasets: [
        {
          label: 'Expenses by Category',
          data,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Function to prepare data for the Line chart
  const prepareLineChartData = () => {
    const dailySpending = {};
    transactions.forEach(transaction => {
      const date = new Date(transaction.createdAt).toLocaleDateString();
      if (transaction.sourceType === "Expense") {
        if (!dailySpending[date]) {
          dailySpending[date] = 0;
        }
        dailySpending[date] += transaction.amount; // Assuming you have amount field
      }
    });

    const labels = Object.keys(dailySpending);
    const data = Object.values(dailySpending);

    return {
      labels,
      datasets: [
        {
          label: 'Spending Over Time',
          data,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
        },
      ],
    };
  };

  const barChartData = prepareBarChartData();
  const lineChartData = prepareLineChartData();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen w-screen text-gray-800 dark:text-gray-200">
      <h2 className="text-3xl text-center mt-6 font-bold mb-6 text-gray-900 dark:text-white">
        Reports & Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Expenses by Category
          </h3>
          {!loading ? (
            <Bar data={barChartData} options={options} />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Spending Over Time
          </h3>
          {!loading ? (
            <Line data={lineChartData} options={options} />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
