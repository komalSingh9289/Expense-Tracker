import React, { useState, useEffect } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { getRecentTransactionsByUserId } from "../api/getRecentTransaction.jsx";
import Loading from "./Loading.jsx";
import { useUser } from "../Context/UserContext";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      try {
        const res = await getRecentTransactionsByUserId();
        setTransactions(res || []);
      } catch (error) {
        console.error("Error fetching transactions", error);
      } finally {
        setLoading(false);
      }
    };
    if(user){
        fetchTransactions();
    }
  }, [user]);

  if (loading) return <Loading />;

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center">
        <p className="text-slate-500 italic">No recent activity detected.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-[2rem] p-6 shadow-xl transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
          Recent Activity
        </h3>
        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 inline-block rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter shadow-sm">
          Latest
        </span>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all duration-200 border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 ${
                transaction.type === "expense" ? "text-rose-500 dark:text-rose-400" : "text-emerald-500 dark:text-emerald-400"
              }`}>
                {transaction.type === "expense" ? (
                  <FaMinusCircle className="w-5 h-5" />
                ) : (
                  <FaPlusCircle className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {transaction.categoryId?.title || "Uncategorized"}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate max-w-[150px]">
                  {transaction.description || "No description provided"}
                </div>
              </div>
            </div>
            <div className={`text-sm font-bold ${
              transaction.type === "expense" ? "text-rose-500 dark:text-rose-400" : "text-emerald-500 dark:text-emerald-400"
            }`}>
              {transaction.type === "expense" ? "-" : "+"}
              ₹{Math.abs(transaction.amount).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
