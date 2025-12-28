import React, { useEffect, useState } from "react";
import AddIncome from "../Components/AddIncome";
import AddExpense from "../Components/AddExpense";
import RecentTransactions from "../Components/RecentTransactions.jsx";
import {getTransactions} from "../api/getTransactions.jsx";
import Loading from "../Components/Loading.jsx";
import { useUser } from "../Context/UserContext";

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savings, setSavings] = useState(0);
  const user = useUser();

useEffect(() => {
  console.log("Wallet useEffect fired");
  console.log("User:", user);

  if (!user) {
    setLoading(false);
    return;
  }

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      console.log("API RESPONSE:", res);

      const data = res || [];
      console.log("Transactions:", data);

      setTransactions(res);

      let income = 0;
      let expenses = 0;

      data.forEach((t) => {
        const amt = Number(t.amount) || 0;
        if (t.type === "income") income += amt;
        if (t.type === "expense") expenses += amt;
      });

      const totalSavings = income - expenses;
      console.log("Savings:", totalSavings);

      setSavings(totalSavings);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchTransactions();
}, [user]);


  if (loading) return <Loading />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            My Wallet
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your funds and add new transactions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AddIncome />
          <AddExpense />
        </div>
      </header>

      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 md:p-12 border border-blue-500/20 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700"></div>
        <div className="relative z-10">
          <h3 className="text-blue-100/80 font-medium mb-2 uppercase tracking-widest text-xs">
            Current Balance
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
              ₹{savings.toLocaleString()}
            </span>
            <span className="text-xl text-blue-200 font-medium">INR</span>
          </div>
         
        </div>
      </div>

     <RecentTransactions />
    </div>
  );
};

export default Wallet;
