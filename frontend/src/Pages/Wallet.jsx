import React, { useEffect, useState } from "react";
import AddIncome from "../Components/AddIncome";
import AddExpense from "../Components/AddExpense";
import RecentTransactions from "../Components/RecentTransactions.jsx";
import getTransactions from "../api/getTransactions.jsx";

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions();
        setTransactions(res);
        console.log("Fetched Transactions: ", res); 

        // Calculate total expenses and income
        let expenses = 0;
        let income = 0;

        res.forEach((transaction) => {
          if (transaction.type === "expense") {
            expenses += transaction.amount;
          } else if (transaction.type === "income") {
            income += transaction.amount;
          }
        });

        setSavings(income - expenses);  // Savings = Income - Expenses
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="flex flex-col h-auto w-screen bg-gray-100 dark:bg-gray-800 p-6">
      {/* Header */}
      <header className="mb-6">
        <h2 className="text-gray-800 text-center dark:text-white text-2xl font-bold mt-5">
          My Wallet
        </h2>
      </header>
      <div className="flex justify-between items-center mb-6">
        <AddIncome />
        <AddExpense />
      </div>

      {/* Wallet Balance */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Wallet Balance
        </h3>
        <p className="text-sm text-green-500">{savings.toFixed(2)} /-</p>
      </div>

     <RecentTransactions />
    </div>
  );
};

export default Wallet;
