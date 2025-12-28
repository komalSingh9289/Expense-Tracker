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
import { getTransactions } from "../api/getTransactions";
import Loading from "../Components/Loading";
import { useUser } from "../Context/UserContext";
import { Navigate } from "react-router-dom";
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
  const user = useUser();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

  if (!user) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions();
        setTransactions(res || []);
      }catch (error) {
  console.error("Error fetching transactions:", error);
  setError("Failed to load reports. Please try again.");
}
 finally {
        setLoading(false);
      }
    };

    if(user){
        fetchTransactions();
    }
  }, [user]);

  const calculateExpensesByTitle = () => {
    const titleData = {};
    transactions.forEach((transaction) => {
      if (transaction.type === "expense" && transaction.categoryId?.title) {
        const title = transaction.categoryId.title;
        if (!titleData[title]) titleData[title] = 0;
        titleData[title] += transaction.amount;
      }
    });
    return titleData;
  };

  const prepareBarChartData = () => {
    const titleData = calculateExpensesByTitle();
    return {
      labels: Object.keys(titleData),
      datasets: [
        {
          label: "Expenses by Category",
          data: Object.values(titleData),
          backgroundColor: [
            "rgba(59, 130, 246, 0.6)",
            "rgba(99, 102, 241, 0.6)",
            "rgba(139, 92, 246, 0.6)",
            "rgba(236, 72, 153, 0.6)",
            "rgba(244, 63, 94, 0.6)"
          ],
          borderColor: "transparent",
          borderWidth: 0,
          borderRadius: 8,
        },
      ],
    };
  };

  const prepareLineChartData = () => {
    const dailySpending = {};
    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        const date = new Date(transaction.date).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
        });
        if (!dailySpending[date]) dailySpending[date] = 0;
        dailySpending[date] += transaction.amount;
      }
    });

    return {
      labels: Object.keys(dailySpending),
      datasets: [
        {
          label: "Spending Over Time",
          data: Object.values(dailySpending),
          fill: true,
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderColor: "rgba(59, 130, 246, 1)",
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "rgba(59, 130, 246, 1)",
        },
      ],
    };
  };

  const barChartData = prepareBarChartData();
  const lineChartData = prepareLineChartData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "gray",
          font: { weight: 'bold', size: 12 }
        }
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "gray" } },
      y: { grid: { color: "rgba(128, 128, 128, 0.1)" }, ticks: { color: "gray" } }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-12">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          Reports & Analytics
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Visual insights into your financial habits and spending patterns.
        </p>
      </header>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-center text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-6 md:p-8 rounded-[2.5rem] shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
            Expenses by Category
          </h3>
          <div className="h-[300px]">
             <Bar data={barChartData} options={options} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-6 md:p-8 rounded-[2.5rem] shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
            Spending Over Time
          </h3>
          <div className="h-[300px]">
            <Line data={lineChartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
