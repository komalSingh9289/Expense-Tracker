import React, { useState, useEffect } from "react";
import getTransactions from "../api/getTransactions"; // Adjust the path as needed
import Loading from "../Components/Loading.jsx";
import Pagination from "../Components/Pagination.jsx"; // Import the Pagination component

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions();
        setTransactions(res); // Update state with fetched transactions
      } catch (error) {
        console.log("Error getting transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Function to format date to d/m/y
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0"); // Pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Filter transactions by search term
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (transaction.categoryId.title &&
        transaction.categoryId.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  // Get transactions for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Function to handle page change
  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  // Show loading state
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen w-screen flex flex-col">
      <h2 className="text-2xl text-center mt-6 font-bold text-gray-800 dark:text-white mb-6">
        Transactions
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left text-sm  text-gray-700 dark:text-gray-300">
                Date
              </th>
              <th className="py-3 px-4 text-left text-sm  text-gray-700 dark:text-gray-300">
                Category
              </th>
              <th className="py-3 px-4 text-left text-sm  text-gray-700 dark:text-gray-300">
                Description
              </th>
              <th className="py-3 px-4 text-left text-sm  text-gray-700 dark:text-gray-300">
                Amount
              </th>
              <th className="py-3 px-4 text-left text-sm  text-gray-700 dark:text-gray-300">
                File
              </th>{" "}
              {/* New column */}
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
                >
                  <td className="py-3 text-sm px-4">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="py-3 text-sm px-4">
                    {transaction.categoryId.title}
                  </td>
                  <td className="py-3 text-sm px-4">
                    {transaction.description}
                  </td>
                  <td
                    className={`py-3 text-sm px-4 ${
                      transaction.type === "expense"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {transaction.type === "expense"
                      ? `- ${Math.abs(transaction.amount).toFixed(2)} /-`
                      : `${transaction.amount.toFixed(2)} /-`}
                  </td>
                  <td className="py-3 text-sm px-4">
                    {transaction.file ? (
                      <a
                        href={`${transaction.file}`}
                        download
                        className="text-blue-500 hover:underline"
                      >
                        Download
                      </a>
                    ) : (
                      "No file"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-4 text-center">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination component */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredTransactions.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Transactions;
