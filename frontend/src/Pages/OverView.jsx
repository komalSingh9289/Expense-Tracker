import React, { useEffect, useState } from "react";
import { FaWallet, FaPiggyBank, FaCoins } from "react-icons/fa";
import { useUser } from "../Context/UserContext";
import RecentTransactions from "../Components/RecentTransactions";
import getTransactions from "../api/getTransactions";
import Loading from "../Components/Loading";

const OverView = () => {
  const user = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
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

        setTotalExpenses(expenses);
        setTotalIncome(income);
        setSavings(income - expenses);  // Savings = Income - Expenses
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <Loading />;
  }

  // Calculate percentage for progress bars
  const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const savingsPercentage = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  return (
    <div className="flex-1 p-6 h-auto mt-5">
      <header className="flex justify-center items-center mb-8">
        <h2 className="dark:text-white text-gray-900 text-2xl font-bold">
          Welcome Back, {user.name}!
        </h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Total Expenses */}
        <div className="bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 from-gray-100 to-gray-300 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-2">
              Total Expenses
            </h3>
            <span className="dark:text-white text-gray-700 text-lg">
              <FaWallet className="text-purple-500 " />
            </span>
          </div>
          <p className="dark:text-gray-300 text-gray-600 text-sm">{totalExpenses.toFixed(2)} /-</p>
          <div className="relative pt-2">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded dark:bg-gray-600 bg-gray-400">
              {/* Dynamic progress based on expensePercentage */}
              <div
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                style={{ width: `${expensePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 2: Income */}
        <div className="bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 from-gray-100 to-gray-300 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-2">
              Income
            </h3>
            <span className="dark:text-white text-gray-700 text-lg">
              <FaPiggyBank className="text-green-500 " />
            </span>
          </div>
          <p className="dark:text-gray-300 text-gray-600 text-sm">{totalIncome.toFixed(2)} /-</p>
          <div className="relative pt-2">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded dark:bg-gray-600 bg-gray-400">
              {/* Since this is the total income, we'll show it at 100% */}
              <div
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 3: Savings */}
        <div className="bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 from-gray-100 to-gray-300 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-2">
              Savings
            </h3>
            <span className="text-white text-lg">
              <FaCoins className="text-yellow-500" />
            </span>
          </div>
          <p className="dark:text-gray-300 text-gray-600 text-sm">{savings.toFixed(2)} /-</p>
          <div className="relative pt-2">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded dark:bg-gray-600 bg-gray-400">
              {/* Dynamic progress based on savingsPercentage */}
              <div
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
                style={{ width: `${savingsPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <RecentTransactions />
    </div>
  );
};

export default OverView;

