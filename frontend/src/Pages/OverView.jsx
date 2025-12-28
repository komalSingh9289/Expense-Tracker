import React, { useEffect, useState } from "react";
import { FaWallet, FaPiggyBank, FaCoins } from "react-icons/fa";
import { useUser } from "../Context/UserContext";
import RecentTransactions from "../Components/RecentTransactions";
import ExpensePieChart from "../Components/ExpensePieChart";
import {getTransactions} from "../api/getTransactions";
import Loading from "../Components/Loading";
import { Navigate } from "react-router-dom";

const OverView = () => {
  const user = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [savings, setSavings] = useState(0);

  if (!user) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions();
        const data = res || []; 
        
        setTransactions(data);
        
        let expenses = 0;
        let income = 0;
        data.forEach((transaction) => {
          if (transaction.type === "expense") {
            expenses += transaction.amount;
          } else if (transaction.type === "income") {
            income += transaction.amount;
          }
        });

        setTotalExpenses(expenses);
        setTotalIncome(income);
        setSavings(income - expenses);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        fetchTransactions();
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const savingsPercentage = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  const stats = [
    {
      title: "Total Expenses",
      amount: totalExpenses,
      icon: <FaWallet className="w-6 h-6" />,
      color: "from-rose-500 to-orange-500",
      progress: expensePercentage,
      progressColor: "bg-rose-500"
    },
    {
      title: "Total Income",
      amount: totalIncome,
      icon: <FaPiggyBank className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
      progress: 100,
      progressColor: "bg-emerald-500"
    },
    {
      title: "Savings",
      amount: savings,
      icon: <FaCoins className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-500",
      progress: savingsPercentage,
      progressColor: "bg-blue-500"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 p-4 md:p-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user.name}. Here's what's happening with your money.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm transition-colors">
            Dec 2025
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="group relative overflow-hidden bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-6 rounded-3xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl dark:hover:bg-slate-800/60"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 dark:opacity-10 blur-3xl group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity`}></div>
            
            <div className="relative flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Monthly</span>
            </div>

            <div className="relative">
              <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">{stat.title}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-800 dark:text-white">₹{stat.amount.toLocaleString()}</span>
                <span className="text-sm text-slate-500 font-medium">INR</span>
              </div>
            </div>

            <div className="mt-6 relative">
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-slate-400 dark:text-slate-500">Utilization</span>
                <span className="text-slate-600 dark:text-slate-300">{Math.round(stat.progress)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${stat.progressColor} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div className="h-full">
          <ExpensePieChart />
        </div>
      </div>
    </div>
  );
};

export default OverView;

