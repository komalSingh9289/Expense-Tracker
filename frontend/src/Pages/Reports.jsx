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
import { getFinancialInsight } from "../api/axios";
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
  const [insight, setInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const [loading, setLoading] = useState(true);

  if (!user) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions();
        setTransactions(res || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to load reports. Please try again.");
      }
      finally {
        setLoading(false);
      }
    };

    if (user) {
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

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    try {
      const res = await getFinancialInsight();
      if (res.success) {
        setInsight(res.insight);
      }
    } catch (err) {
      console.error("Failed to generate insight:", err);
      // Optional: set a separate UI error state for insights
    } finally {
      setLoadingInsight(false);
    }
  };

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

  // Function to highlight numbers and currency
  const highlightNumbers = (text) => {
    if (!text) return null;

    // Regex to match:
    // 1. Currency: ₹ 1,000 or ₹1000 or ₹ 1.5k
    // 2. Percentages: 50% or 50.5%
    // 3. Plain numbers (optional, but currency/percent is most important for finance)
    const regex = /(₹\s?[\d,]+(\.\d+)?k?)|(\d+(\.\d+)?%)/gi;

    const parts = text.split(regex);

    return parts.filter(part => part !== undefined).map((part, index) => {
      if (part.match(regex)) {
        return (
          <span key={index} className="font-bold text-indigo-600 dark:text-indigo-400">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const parseInsight = (text) => {
    if (!text) return null;

    // Use a strict structure from backend, but handle variations
    const sections = {
      summary: "",
      metrics: [],
      tips: []
    };

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    let current = "summary";

    lines.forEach(line => {
      const lower = line.toLowerCase();
      // Detect section headers
      if (lower.includes("financial health") || lower.includes("summary")) {
        current = "summary";
        return; // skip header line
      } else if (lower.includes("key metrics") || lower.includes("spending analysis")) {
        current = "metrics";
        return;
      } else if (lower.includes("actionable tips") || lower.includes("recommendations")) {
        current = "tips";
        return;
      }

      // Add content to current section
      // Clean leading bullets/numbers
      const cleanLine = line.replace(/^[\*•-]\s*/, "").replace(/^\d+\.\s*/, "");

      if (cleanLine.length < 3) return; // Skip empty/short lines

      if (current === "summary") {
        // Append to summary, adding space if needed
        sections.summary += (sections.summary ? " " : "") + cleanLine;
      } else if (current === "metrics") {
        sections.metrics.push(cleanLine);
      } else if (current === "tips") {
        sections.tips.push(cleanLine);
      }
    });

    return sections;
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

      {/* AI Insights Section */}
      <div className="bg-white dark:bg-slate-950/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/10 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">AI Financial Insights</h3>
          </div>

          <button
            onClick={handleGenerateInsight}
            disabled={loadingInsight}
            className="flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loadingInsight ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                Generate New Insight
              </>
            )}
          </button>
        </div>

        {insight ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
              {(() => {
                const parsed = parseInsight(insight);

                return (
                  <div className="space-y-6">

                    {/* SUMMARY */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">

                      <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-600 font-medium">
                        Excellent Financial Health
                      </span>
                      <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                        {highlightNumbers(parsed.summary)}
                      </p>
                    </div>

                    {/* METRICS */}
                    {parsed.metrics.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                          Spending Analysis
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {parsed.metrics.map((metric, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3"
                            >
                              <div className="mt-1 p-1 bg-blue-500/10 rounded-full">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 font-medium leading-normal">
                                {highlightNumbers(metric)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ACTION TIPS */}
                    {parsed.tips.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                          Actionable Tips
                        </h4>
                        <ul className="space-y-3">
                          {parsed.tips.map((tip, idx) => (
                            <li
                              key={idx}
                              className="flex gap-4 p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-200 transition-colors"
                            >
                              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                                {idx + 1}
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                                {highlightNumbers(tip)}
                              </p>

                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                );
              })()}

            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">
              These insights are generated by AI based on your recent transaction history.
            </p>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Click the button above to receive personalized financial advice.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Reports;
