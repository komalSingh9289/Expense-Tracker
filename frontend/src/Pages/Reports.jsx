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
 // for date formatting

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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions();
        setTransactions(res);
        console.log("Fetched Transactions: ", res);
      } catch (error) {
        setError("Failed to load transactions. Please try again.");
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
    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        console.log( "all ",transactions);
        
        const title = transaction.categoryId.title; // Use title to categorize
        if (!titleData[title]) {
          titleData[title] = 0;
        }
        titleData[title] += transaction.amount; // Assuming you have amount field
      }else{
        console.log("error");
        
      }
    });
    return titleData;
  };

  // Function to prepare data for the Bar chart
  const prepareBarChartData = () => {
    const titleData = calculateExpensesByTitle();
    const labels = Object.keys(titleData);
    const data = Object.values(titleData);
    console.log("yuot", data);
    

    return {
      labels,
      datasets: [
        {
          label: "Expenses by Category",
          data,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Function to prepare data for the Line chart
  const prepareLineChartData = () => {
    const dailySpending = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString('en-US', {
        month: 'short', // e.g., "Oct"
        day: '2-digit', // e.g., "18"
        year: 'numeric', // e.g., "2024"
      });
      if (transaction.type === "expense") {
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
          label: "Spending Over Time",
          data,
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
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

      {error && (
        <p className="text-red-500 text-center mb-6">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Expenses by Category
          </h3>
          {!loading ? (
            <Bar data={barChartData} options={options} />
          ) : (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-5 w-5 text-gray-800 dark:text-gray-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Spending Over Time
          </h3>
          {!loading ? (
            <Line data={lineChartData} options={options} />
          ) : (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-5 w-5 text-gray-800 dark:text-gray-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
