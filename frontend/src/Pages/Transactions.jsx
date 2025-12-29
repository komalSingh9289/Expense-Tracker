
import React, { useState, useEffect } from "react";
import { downloadTransactions, getTransactions } from "../api/getTransactions"; // Adjust the path as needed
import { useUser } from "../Context/UserContext";
import Loading from "../Components/Loading.jsx";
import axios from '../api/axios';
import Pagination from "../Components/Pagination.jsx";
import { updateTransaction, removeTransaction, removeManyTransactions } from "../api/addTransaction";
import ConfirmDialog from "../Components/ConfirmDialog.jsx";
import EditTransactionModal from "../Components/EditTransactionModal.jsx";

const Transactions = () => {
  const user = useUser();
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Keep loading state as it's used later
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [typeFilter, setTypeFilter] = useState("all"); // all | income | expense
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);


  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) {
        setLoading(false); // Ensure loading is set to false if no user
        return;
      }
      try {
        const res = await getTransactions();
        const data = res || [];
        // Sort by date descending
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(sortedData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]); // Add user to dependency array

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.categoryId?.title &&
        transaction.categoryId.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      typeFilter === "all" || transaction.type === typeFilter;

    const transactionDate = new Date(transaction.date);
    const matchesStartDate = startDate
      ? transactionDate >= new Date(startDate)
      : true;
    const matchesEndDate = endDate
      ? transactionDate <= new Date(endDate)
      : true;

    return matchesSearch && matchesType && matchesStartDate && matchesEndDate;
  });


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handleDownload = async () => {
    try {
      const res = await downloadTransactions();

      // Create blob and download
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // clean up memory
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleEdit = (transaction) => {
    setTransactionToEdit(transaction);
    setEditModalOpen(true);
  };

  const handleUpdateSuccess = (updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t._id === updatedTransaction._id ? updatedTransaction : t))
    );
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await removeTransaction(transactionToDelete._id);

      // update UI immediately
      setTransactions((prev) =>
        prev.filter((t) => t._id !== transactionToDelete._id)
      );

      setConfirmOpen(false);
      setTransactionToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setTransactionToDelete(null);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTransactions(transactions.map((t) => t._id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(selectedTransactions.filter((tId) => tId !== id));
    } else {
      setSelectedTransactions([...selectedTransactions, id]);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const res = await removeManyTransactions(selectedTransactions);
      if (res?.success) {
        setTransactions((prev) => prev.filter((t) => !selectedTransactions.includes(t._id)));
        setSelectedTransactions([]);
        setBulkDeleteConfirmOpen(false);
      }
    } catch (error) {
      console.error("Bulk delete failed:", error);
    }
  };


  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4 md:p-12 pb-10">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Transactions</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review and manage your spending history.</p>
        </div>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-sm"
          />
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg transition-all active:scale-95"
        >
          Download PDF
        </button>
      </div>
      <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-colors"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>

          {/* Start Date */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-colors"
          />

          {/* End Date */}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-colors"
          />

          {/* Clear Filters */}
          <button
            onClick={() => {
              setTypeFilter("all");
              setStartDate("");
              setEndDate("");
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-white font-bold transition-all py-2.5 border border-slate-200 dark:border-slate-600/50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto  scrollbar-hide" >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                  {selectedTransactions.length > 0 ? (
                    <button
                      onClick={() => setBulkDeleteConfirmOpen(true)}
                      className="text-rose-500 hover:text-rose-600 font-bold"
                    >
                      Delete ({selectedTransactions.length})
                    </button>
                  ) : "Select"}
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                  Date
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Type</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Category</th>
                 <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Description</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Receipt</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
              {currentTransactions.length > 0 ? (
                currentTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className={`group hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors duration-200 ${selectedTransactions.includes(transaction._id) ? "bg-rose-50 dark:bg-rose-900/10" : ""
                      }`}
                  >
                    <td className="py-4 px-6 text-center">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.includes(transaction._id)}
                        onChange={() => handleSelectOne(transaction._id)}
                        className="w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                      />
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-600 dark:text-slate-300 text-center">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {transaction.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {transaction.categoryId?.title || "Uncategorized"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors italic font-medium">
                        {transaction.description || "—"}
                      </div>
                    </td>
                    <td className={`py-4 px-6 text-right font-bold text-sm ${transaction.type === "expense" ? "text-rose-500 dark:text-rose-400" : "text-emerald-500 dark:text-emerald-400"
                      }`}>
                      {transaction.type === "expense" ? "-" : "+"}
                      ₹{Math.abs(transaction.amount).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {transaction.file ? (
                        <a
                          href={transaction.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-600/50"
                          title="View Receipt"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-600/50"
                          title="Edit Transaction"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(transaction)}
                          className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-600/50"
                          title="Delete Transaction"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400 dark:text-slate-500 italic font-medium">
                    No transactions found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredTransactions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete transaction?"
        message={`Are you sure you want to delete "${transactionToDelete?.description || "this transaction"}"?`}
        confirmText="Yes, delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <EditTransactionModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setTransactionToEdit(null);
        }}
        transaction={transactionToEdit}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <ConfirmDialog
        isOpen={bulkDeleteConfirmOpen}
        title="Delete transactions?"
        message={`Are you sure you want to delete ${selectedTransactions.length} selected transactions?`}
        confirmText="Yes, delete all"
        cancelText="Cancel"
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default Transactions;
