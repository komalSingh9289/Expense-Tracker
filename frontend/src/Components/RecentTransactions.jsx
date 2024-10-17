import React, { useState, useEffect } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import getRecentTransaction from "../api/getRecentTransaction.jsx";
import Loading from "./Loading.jsx";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getRecentTransaction();
        console.log(res);
        
        setTransactions(res);
      } catch (error) {
        console.error("Error fetching transactions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Loading state
  if (loading) {
    return <Loading />;
  }

  // No transactions state
  if (!transactions || transactions.length === 0) {
    return <div>No Recent Transactions</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 flex-1 mt-5">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Recent Transactions
      </h3>
      <ul>
        {transactions.map((transaction, index) => (
          <li
            key={index}
            className="flex justify-between items-center text-gray-600 dark:text-gray-400 mb-3"
          >
            <span className="flex items-center">
              {transaction.type === "expense" ? (
                <FaMinusCircle className="text-red-500 mr-2 text-sm" />
              ) : (
                <FaPlusCircle className="text-green-500 mr-2 text-sm" />
              )}
              {/* Display the correct description or category here */}
              {transaction.categoryId.title || transaction.description}
            </span>
            <span
              className={
                transaction.type === "expense" ? "text-red-500 text-sm" : "text-green-500 text-sm"
              }
            >
              {transaction.type === "expense"
                ? `-${(transaction.amount).toFixed(2)} /-`
                : `+${(transaction.amount).toFixed(2)} /-`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
